import { useState, Fragment } from 'react';
import { waxService } from '../../../services/waxService';
import { toast } from 'sonner';
import { Button } from '../../../components/common/Button';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { Container } from '../../../components/common/Container';
import { InputField } from '../../../components/common/InputField';

const CREDITS_PER_CENT = Number(import.meta.env.VITE_CREDITS_PER_CENT);

interface BuyWaxModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function BuyWaxModal({ open, onClose, onSuccess }: BuyWaxModalProps) {
  const [amountInDollars, setAmountInDollars] = useState(10);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const creditsToReceive = amountInDollars * 100 * CREDITS_PER_CENT;

  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      await waxService.purchaseWax(amountInDollars);
      toast.success('Wax purchased successfully');
      onClose();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? 'Failed to purchase wax');
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <Transition appear show={open} as={Fragment}>
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
                      Add Wax
                    </DialogTitle>

                    <div className="w-full mb-6">
                      <label className="block text-sm font-medium text-[#91ACC8] mb-2 text-left">
                        Amount ($)
                      </label>
                      <InputField
                        type="number"
                        id="wax-amount"
                        placeholder="Enter amount"
                        value={amountInDollars}
                        onChange={(e) => setAmountInDollars(Number(e.target.value))}
                      />
                      <p className="text-sm text-[#91ACC8] mt-2 text-left">
                        You will receive {creditsToReceive.toLocaleString()} wax credits.
                      </p>
                    </div>

                    <div className="w-full border-t border-[rgba(255,255,255,0.1)] pt-4 mb-8">
                      <div className="flex justify-between mb-2 text-white">
                        <span>Total</span>
                        <span className="font-bold">${amountInDollars.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex justify-center gap-4 w-full">
                      <Button variant="ghost" size="md" onClick={onClose}>
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        size="md"
                        onClick={handlePurchase}
                        isLoading={isPurchasing}
                      >
                        Purchase
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
}
