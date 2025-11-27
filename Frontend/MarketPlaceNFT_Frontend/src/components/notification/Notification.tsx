// src/components/NotificationList.tsx
import React, { useEffect } from "react";
import {
  CheckCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/solid";
import useNotificationStore from "../../stores/useNotificationStore";
import { useNetwork } from "../../contexts/NetworkConfigurationProvider";
import NotificationSVG from "../SVG/NotificationSVG";


const NotificationList = () => {
  const { notifications, set: setNotificationStore } = useNotificationStore();
  const reversedNotifications = [...notifications].reverse();

  return (
    <div className="pointer-events-none fixed inset-0 z-20 flex items-end px-4 py-6 sm:p-6">
      <div className="flex w-full flex-col">
        {reversedNotifications.map((n, idx) => (
          <Notification
            key={`${n.message}${idx}`}
            type={n.type}
            message={n.message}
            description={n.description}
            txid={n.txid}
            onHide={() => {
              setNotificationStore((state: any) => {
                const reversedIndex = reversedNotifications.length - 1 - idx;
                return {
                  ...state,
                  notifications: [
                    ...state.notifications.slice(0, reversedIndex),
                    ...state.notifications.slice(reversedIndex + 1),
                  ],
                };
              });
            }}
          />
        ))}
      </div>
    </div>
  );
};

const Notification = ({ type, message, description, txid, onHide }: any) => {
  const { network } = useNetwork();

  useEffect(() => {
    const id = setTimeout(() => {
      onHide();
    }, 8000);
    return () => clearTimeout(id);
  }, [onHide]);

  const getExplorerUrl = (txHash: string) => {
    return `${network.blockExplorerUrl}/tx/${txHash}`; // ĐÃ SỬA
  };

  return (
    <div className="bg-bkg-1 pointer-events-auto z-50 mx-4 mt-2 mb-12 w-full max-w-sm overflow-hidden rounded-md bg-[#0a1023] p-2 shadow-lg">
      <div className="p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {type === "success" ? <CheckCircleIcon className="text-success mr-1 h-8 w-8" /> : null}
            {type === "info" ? <InformationCircleIcon className="text-info mr-1 h-8 w-8" /> : null}
            {type === "error" ? <XCircleIcon className="text-error mr-1 h-8 w-8" /> : null}
          </div>
          <div className="ml-2 w-0 flex-1">
            <div className="text-fgd-1 font-bold">{message}</div>
            {description && <p className="text-fgd-2 mt-0.5 text-sm">{description}</p>}
            {txid && (
              <div className="flex flex-row">
                <a
                  href={getExplorerUrl(txid)}
                  target="_blank"
                  rel="noreferrer"
                  className="link-accent link flex flex-row"
                >
                  <NotificationSVG />
                  <div className="mx-4 flex">
                    {txid.slice(0, 8)}...{txid.slice(-8)}
                  </div>
                </a>
              </div>
            )}
          </div>
          <div className="ml-4 flex flex-shrink-0 self-start">
            <button
              onClick={onHide}
              className="bg-bkg-2 default-transition text-fgd-3 hover:text-fgd-4 inline-flex rounded-md focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationList;