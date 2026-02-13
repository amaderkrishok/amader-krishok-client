import { useState, useEffect } from 'react';
import { StoreService } from '@/services/store-service';
import { UserService } from '@/services/user-service';
import type { RoomResponseDto } from '@/types/chat';

interface ChatParticipantInfo {
	name: string;
	image?: string;
	role: string;
	phoneNumber?: string;
	address?: string;
	isLoading: boolean;
	error?: string;
}

/**
 * Custom hook to fetch and manage chat participant information
 *
 * @description This hook:
 * - Fetches store information for vendor participants
 * - Fetches user information for user participants
 * - Provides proper display names and details
 * - Handles loading and error states
 *
 * @param room - The chat room containing participant information
 * @returns ChatParticipantInfo with resolved participant details
 */
export function useChatParticipant(
	room?: RoomResponseDto
): ChatParticipantInfo {
	const [participantInfo, setParticipantInfo] = useState<ChatParticipantInfo>({
		name: 'Unknown User',
		role: 'USER',
		isLoading: true,
	});

	useEffect(() => {
		if (!room?.participant) {
			setParticipantInfo({
				name: 'Unknown User',
				role: 'USER',
				isLoading: false,
			});
			return;
		}

		const fetchParticipantInfo = async () => {
			try {
				setParticipantInfo((prev) => ({
					...prev,
					isLoading: true,
					error: undefined,
				}));

				const participant = room.participant;

				if (participant.role === 'VENDOR') {
					// Fetch store information for vendors
					try {
						const storeInfo = await StoreService.getStoreByOwnerId(
							participant.id
						);
						setParticipantInfo({
							name: storeInfo.storeName,
							image: participant.image,
							role: participant.role,
							phoneNumber: storeInfo.ownerPhone,
							address: storeInfo.storeLocation,
							isLoading: false,
						});
					} catch (storeError) {
						console.warn(
							'Failed to fetch store info, falling back to participant name:',
							storeError
						);
						// Fallback to participant name if store info fails
						setParticipantInfo({
							name: participant.name || 'Vendor',
							image: participant.image,
							role: participant.role,
							isLoading: false,
						});
					}
				} else {
					// For users, try to fetch user details
					try {
						const userInfo = await UserService.getUser(participant.id);
						setParticipantInfo({
							name: userInfo.data?.name || participant.name || 'User',
							image: userInfo.data?.image || participant.image,
							role: participant.role,
							phoneNumber: userInfo.data?.phoneNumber,
							isLoading: false,
						});
					} catch (userError) {
						console.warn(
							'Failed to fetch user info, falling back to participant name:',
							userError
						);
						// Fallback to participant name if user info fails
						setParticipantInfo({
							name: participant.name || 'User',
							image: participant.image,
							role: participant.role,
							isLoading: false,
						});
					}
				}
			} catch (error) {
				console.error('Error fetching participant info:', error);
				setParticipantInfo({
					name: room?.participant?.name || 'Unknown User',
					image: room?.participant?.image,
					role: room?.participant?.role || 'USER',
					isLoading: false,
					error: 'Failed to load participant information',
				});
			}
		};

		fetchParticipantInfo();
	}, [room?.participant?.id, room?.participant?.role, room?.participant]);

	return participantInfo;
}
