import React, { useEffect, useState, Fragment } from 'react';
import { waxService } from '../../../services/waxService';
import { toast } from 'sonner';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { Container } from '../../../components/common/Container';
import { Button } from '../../../components/common/Button';
import { InputField } from '../../../components/common/InputField';
import type { AutoReloadSettings } from '../../../types/wax.types';

interface WaxAutoReloadSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: AutoReloadSettings;
  onSuccess?: () => void;
}

const WaxAutoReloadSettingModal = ({
  isOpen,
  onClose,
  initialData,
  onSuccess,
}: WaxAutoReloadSettingModalProps) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [threshold, setThreshold] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setIsEnabled(initialData.enabled);
      setThreshold(initialData.threshold || 0);
      setAmount(initialData.amount || 0);
    }
  }, [initialData]);

  const handleSubmit = async () => {
    try {
      setIsSaving(true);

      await waxService.updateAutoReloadSettings({
        enabled: isEnabled,
        threshold,
        amount,
      });

      toast.success('Auto reload settings updated successfully');
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error('Failed to update auto reload settings', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
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
                      Auto Reload Settings
                    </DialogTitle>

                    <div className="w-full mb-6 flex items-center justify-between">
                      <span className="text-sm font-medium text-[#91ACC8]">
                        Enable Auto Reload
                      </span>
                      <div
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${isEnabled ? 'bg-[#F98B8D]' : 'bg-gray-600'
                          }`}
                        onClick={() => setIsEnabled(!isEnabled)}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                      </div>
                    </div>

                    <div className="w-full mb-4">
                      <label className="mb-2 block text-sm font-medium text-[#91ACC8] text-left">
                        Reload when credits fall below
                      </label>
                      <InputField
                        type="number"
                        id="reload-threshold"
                        placeholder="Enter threshold"
                        value={threshold}
                        onChange={(e) => setThreshold(Number(e.target.value))}
                        disabled={!isEnabled}
                      />
                    </div>

                    <div className="w-full mb-8">
                      <label className="mb-2 block text-sm font-medium text-[#91ACC8] text-left">
                        Reload amount (in dollars)
                      </label>
                      <InputField
                        type="number"
                        id="reload-amount"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        disabled={!isEnabled}
                      />
                    </div>

                    <div className="flex justify-center gap-4 w-full">
                      <Button variant="ghost" size="md" onClick={onClose}>
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        size="md"
                        onClick={handleSubmit}
                        isLoading={isSaving}
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
