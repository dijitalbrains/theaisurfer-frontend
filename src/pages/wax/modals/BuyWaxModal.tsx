import React, { useState, Fragment } from "react";
import { waxService } from "../../../services/waxService";
import { toast } from "react-hot-toast";
import { Button } from "../../../components/common/Button";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Container } from "../../../components/common/Container";
import { InputField } from "../../../components/common/InputField";

export function BuyWaxModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [amount, setAmount] = useState(10);
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      await waxService.purchase(amount);
      toast.success("Wax purchase Successfully");
      onClose();
      onSuccess?.();
    } catch (e: any) {
      toast.error(e.response?.data?.message ?? "Error");
    } finally {
      setLoading(false);
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
                        id="buywax"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                      />
                      <p className="text-sm text-[#91ACC8] mt-2 text-left">
                        You will get {(amount * 3600).toLocaleString()} wax.
                      </p>
                    </div>

                    <div className="w-full border-t border-[rgba(255,255,255,0.1)] pt-4 mb-8">
                      <div className="flex justify-between mb-2 text-white">
                        <span>Total</span>
                        <span className="font-bold">${amount.toFixed(2)}</span>
                      </div>
                    </div>

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
                        onClick={handlePurchase}
                        isLoading={loading}
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
