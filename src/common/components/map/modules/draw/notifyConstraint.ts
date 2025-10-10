import { TFunction } from 'i18next';
import React from 'react';
import { NotificationProps } from 'hds-react';

// Supported constraint notification kinds
export type ConstraintNotificationKind = 'selfIntersecting' | 'outsideArea';

// Mapping of kind -> translation keys
const LABEL_KEYS: Record<ConstraintNotificationKind, string> = {
  selfIntersecting: 'map:notifications:selfIntersectingLabel',
  outsideArea: 'map:notifications:drawingOutsideHankeAreaLabel',
};

const MESSAGE_KEYS: Record<ConstraintNotificationKind, string> = {
  selfIntersecting: 'map:notifications:selfIntersectingText',
  outsideArea: 'map:notifications:drawingOutsideHankeAreaText',
};

type NotificationOptions = NotificationProps & { message: string | React.ReactElement };

export interface NotifyConstraintOptions {
  autoCloseDuration?: number; // override default duration
  labelKeyOverride?: string;
  messageKeyOverride?: string;
  typeOverride?: string; // alert, success, error etc.
}

/**
 * Unified helper to show constraint notifications (drawing outside area or self-intersection).
 */
export function notifyConstraint(
  setNotification: (open: boolean, options?: NotificationOptions) => void,
  t: TFunction,
  kind: ConstraintNotificationKind,
  opts: NotifyConstraintOptions = {},
): void {
  const labelKey = opts.labelKeyOverride ?? LABEL_KEYS[kind];
  const messageKey = opts.messageKeyOverride ?? MESSAGE_KEYS[kind];
  setNotification(true, {
    position: 'top-right',
    dismissible: true,
    autoClose: true,
    autoCloseDuration: opts.autoCloseDuration ?? 5000,
    label: t(labelKey),
    message: t(messageKey),
    type: (opts.typeOverride as NotificationProps['type']) ?? 'alert',
    closeButtonLabelText: t('common:components:notification:closeButtonLabelText'),
  });
}
