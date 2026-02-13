import { useState, useEffect, useMemo } from 'react';
import { StoreService } from '@/services/store-service';
import { UserService } from '@/services/user-service';
import type { RoomResponseDto } from '@/types/chat';

interface RoomWithResolvedName extends RoomResponseDto {
	resolvedParticipantName: string;
}

/**
 * Custom hook to provide chat rooms with resolved participant names for search functionality
 *
 * @description This hook:
 * - Resolves actual display names for all participants (store names for vendors, user names for users)
 * - Provides filtered rooms based on search query using resolved names
 * - Handles loading and error states
 *
 * @param rooms - Array of chat rooms
 * @param searchQuery - Search query string
 * @returns Object with filtered rooms and loading state
 */
export function useChatSearch(rooms: RoomResponseDto[], searchQuery: string) {
	const [roomsWithResolvedNames, setRoomsWithResolvedNames] = useState<
		RoomWithResolvedName[]
	>([]);
	const [isResolving, setIsResolving] = useState(false);

	// Resolve participant names for all rooms
	useEffect(() => {
		if (!rooms.length) {
			setRoomsWithResolvedNames([]);
			return;
		}

		const resolveParticipantNames = async () => {
			setIsResolving(true);

			try {
				const resolvedRooms = await Promise.all(
					rooms.map(async (room) => {
						let resolvedName = room.participant.name || 'Unknown User';

						try {
							if (room.participant.role === 'VENDOR') {
								// Fetch store information for vendors
								const storeInfo = await StoreService.getStoreByOwnerId(
									room.participant.id
								);
								resolvedName = storeInfo.storeName;
							} else {
								// For users, try to fetch user details
								const userInfo = await UserService.getUser(room.participant.id);
								resolvedName =
									userInfo.data?.name || room.participant.name || 'User';
							}
						} catch (error) {
							// Use fallback name if API call fails
							console.warn(
								`Failed to resolve name for ${room.participant.role}:`,
								error
							);
						}

						return {
							...room,
							resolvedParticipantName: resolvedName,
						} as RoomWithResolvedName;
					})
				);

				setRoomsWithResolvedNames(resolvedRooms);
			} catch (error) {
				console.error('Error resolving participant names:', error);
				// Fallback to original names
				setRoomsWithResolvedNames(
					rooms.map((room) => ({
						...room,
						resolvedParticipantName: room.participant.name || 'Unknown User',
					}))
				);
			} finally {
				setIsResolving(false);
			}
		};

		resolveParticipantNames();
	}, [rooms]);

	// Filter rooms based on search query using resolved names
	const filteredRooms = useMemo(() => {
		if (!searchQuery.trim()) return roomsWithResolvedNames;

		const query = searchQuery.toLowerCase();
		return roomsWithResolvedNames.filter(
			(room) =>
				room.resolvedParticipantName.toLowerCase().includes(query) ||
				room.participant.name.toLowerCase().includes(query) || // Also search original name as fallback
				room.lastMessage?.content.toLowerCase().includes(query)
		);
	}, [roomsWithResolvedNames, searchQuery]);

	return {
		filteredRooms: filteredRooms.map((room) => ({
			...room,
			// Remove the resolved name from the returned rooms to maintain original structure
			resolvedParticipantName: undefined,
		})) as RoomResponseDto[],
		isResolving,
	};
}
