import { atom } from 'jotai';
import { Notification } from '../model/notificationModels';

// 기본 아톰: 알림 목록을 저장
export const notificationsAtom = atom<Notification[]>([]);

// 쓰기 전용 아톰: 알림 제거 로직
export const removeNotificationAtom = atom(
  null,
  (get, set, id: number) => {
    set(notificationsAtom, (prev) => prev.filter((n) => n.id !== id));
  }
);

// 쓰기 전용 아톰: 알림 추가 로직
export const addNotificationAtom = atom(
  null,
  (get, set, message: string) => {
    const newNotification: Notification = {
      id: Date.now(),
      message,
      type: 'success',
    };
    set(notificationsAtom, (prev) => [...prev, newNotification]);

    // 3초 후에 알림을 자동으로 제거
    setTimeout(() => {
      set(removeNotificationAtom, newNotification.id);
    }, 3000);
  }
);
