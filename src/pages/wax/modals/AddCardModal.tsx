import React, { useState, Fragment } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { waxService } from "../../../services/waxService";
import toast from "react-hot-toast";
// import { appConfig } from "../../../config/appConfig.ts";
import { Button } from "../../../components/common/Button";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Container } from "../../../components/common/Container";

const stripePromise = loadStripe(
  "pk_test_51Nd0aQIJpvqvRxISriiXTM98dTOZXNUtACLyIMGxoImOTbuOjjkqgowkdo2Acfhs7xPbeHQjO1uuBntSan6nU6qk002wruoMPA"
);

const AddCardForm = ({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess?: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [fieldValid, setFieldValid] = useState({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false,
  });

  const getStyle = (field: "cardNumber" | "cardExpiry" | "cardCvc") => ({
    base: {
      fontSize: "14px",
      fontFamily: "Inter, system-ui, sans-serif",
      fontWeight: "normal",
      color: fieldValid[field] ? "#70FFE9" : "white",
      "::placeholder": {
        color: "grey",
      },
      iconColor: fieldValid[field] ? "#70FFE9" : "white",
    },
    invalid: {
      color: "#FF6471",
      iconColor: "#FF6471",
    },
  });

  const handleCardChange = (
    field: "cardNumber" | "cardExpiry" | "cardCvc",
    e: any
  ) => {
    setFieldValid((prev) => ({
      ...prev,
      [field]: e.complete,
    }));
  };

  const saveCard = async () => {
    if (!stripe || !elements) return;
    setLoading(true);

    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) return;

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        toast.error(error.message || "Failed to create payment method");
        setLoading(false);
        return;
      }

      await waxService.addCard(paymentMethod.id);
      toast.success("Card saved");
      onClose();
      onSuccess?.();
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to save card"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <DialogTitle
        as="h3"
        className="text-[20px] font-bold text-white mb-6 text-center"
      >
        Add New Card
      </DialogTitle>

      <div className="w-full space-y-4 mb-6">
        <div>
          <label className="block text-[#D1D5DC] text-[12px] font-medium mb-1 text-left">
            Card Number
          </label>
          <div className="relative w-full bg-[#080C10] border border-[#91ACC833] rounded-[15px] px-4 py-3 transition-all">
            <CardNumberElement
              options={{
                style: getStyle("cardNumber"),
                showIcon: true,
              }}
              onChange={(e) => handleCardChange("cardNumber", e)}
            />
          </div>
        </div>

        <div>
          <label className="block text-[#D1D5DC] text-[12px] font-medium mb-1 text-left">
            Expiry Date
          </label>
          <div className="relative w-full bg-[#080C10] border border-[#91ACC833] rounded-[15px] px-4 py-3 transition-all">
            <CardExpiryElement
              options={{
                style: getStyle("cardExpiry"),
              }}
              onChange={(e) => handleCardChange("cardExpiry", e)}
            />
          </div>
        </div>

        <div>
          <label className="block text-[#D1D5DC] text-[12px] font-medium mb-1 text-left">
            CVC
          </label>
          <div className="relative w-full bg-[#080C10] border border-[#91ACC833] rounded-[15px] px-4 py-3 transition-all">
            <CardCvcElement
              options={{
                style: getStyle("cardCvc"),
              }}
              onChange={(e) => handleCardChange("cardCvc", e)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 w-full mt-4">
        <Button variant="ghost" size="md" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={saveCard}
          isLoading={loading}
        >
          Save Card
        </Button>
      </div>
    </div>
  );
};

export function AddCardModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
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
                  <Elements stripe={stripePromise}>
                    <AddCardForm onClose={onClose} onSuccess={onSuccess} />
                  </Elements>
                </Container>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
