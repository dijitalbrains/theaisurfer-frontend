import React, { useEffect, useState, Fragment } from "react";
import { waxService } from "../../../services/waxService";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Container } from "../../../components/common/Container";
import { Button } from "../../../components/common/Button";
import { InputField } from "../../../components/common/InputField";

interface WaxAutoReloadSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    autoReload: boolean;
    reloadThreshold: number;
    reloadAmount: number;
  };
  onSuccess?: () => void;
}

const WaxAutoReloadSettingModal = ({
  isOpen,
  onClose,
  initialData,
  onSuccess,
}: WaxAutoReloadSettingModalProps) => {
  const [autoReloadEnabled, setAutoReloadEnabled] = useState(false);
  const [reloadThreshold, setReloadThreshold] = useState<number>(0);
  const [reloadAmount, setReloadAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setAutoReloadEnabled(initialData.autoReload);
      setReloadThreshold(initialData.reloadThreshold || 0);
      setReloadAmount(initialData.reloadAmount || 0);
    }
  }, [initialData]);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await waxService.updateAutoReload({
        autoReloadEnabled,
        reloadThreshold,
        reloadAmount,
      });

      toast.success("Auto reload settings updated");
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error("Failed to update auto reload settings", error);
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 backdrop-blur-xl bg-black/30" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-[500px] transform overflow-hidden rounded-2xl text-left align-middle shadow-[0px_24px_104px_0px_#000000A6] backdrop-blur-xl transition-all">
                <Container>
                  <div className="flex flex-col items-center">
                    <DialogTitle
                      as="h3"
                      className="text-[20px] font-bold text-white mb-6"
                    >
                      Wax Auto Reload Settings
                    </DialogTitle>

                    {/* Enable Toggle */}
                    <div className="w-full mb-6 flex items-center justify-between">
                      <span className="text-sm font-medium text-[#91ACC8]">
                        Enable Auto Reload
                      </span>
                      <div
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                          autoReloadEnabled ? "bg-[#F98B8D]" : "bg-gray-600"
                        }`}
                        onClick={() => setAutoReloadEnabled(!autoReloadEnabled)}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            autoReloadEnabled
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Threshold */}
                    <div className="w-full mb-4">
                      <label className="mb-2 block text-sm font-medium text-[#91ACC8] text-left">
                        Reload when credits fall below
                      </label>
                      <InputField
                        type="number"
                        id="reloadThreshold"
                        placeholder="Enter threshold"
                        value={reloadThreshold}
                        onChange={(e) =>
                          setReloadThreshold(Number(e.target.value))
                        }
                        disabled={!autoReloadEnabled}
                      />
                    </div>

                    {/* Reload Amount */}
                    <div className="w-full mb-8">
                      <label className="mb-2 block text-sm font-medium text-[#91ACC8] text-left">
                        Reload credits amount
                      </label>
                      <InputField
                        type="number"
                        id="reloadAmount"
                        placeholder="Enter amount"
                        value={reloadAmount}
                        onChange={(e) =>
                          setReloadAmount(Number(e.target.value))
                        }
                        disabled={!autoReloadEnabled}
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center gap-4 w-full">
                      <Button
                        variant="ghost"
                        size="md"
                        onClick={onClose}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        size="md"
                        onClick={handleSubmit}
                        isLoading={loading}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </Container>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default WaxAutoReloadSettingModal;
