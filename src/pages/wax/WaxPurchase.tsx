import React, { useState, useEffect, useCallback } from "react";
import { CheckCircle } from "lucide-react";
import { waxService } from "../../services/waxService";
import { AddCardModal } from "./modals/AddCardModal";
import { BuyWaxModal } from "./modals/BuyWaxModal";
import WaxAutoReloadSettingModal from "./modals/WaxAutoReloadSettingModal";
import { Container } from "../../components/common/Container";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";
import { CardDetail } from "../../components/common/CardDetail";
import type { WaxDetails } from "../../types/wax.types";

export const WaxPurchase: React.FC = () => {
  const [data, setData] = useState<WaxDetails | null>(null);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showBuyWax, setShowBuyWax] = useState(false);
  const [showAutoReload, setShowAutoReload] = useState(false);

  const refreshData = useCallback(() => {
    waxService.getDetails().then((data) => setData(data));
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  if (!data)
    return (
      <div className="h-full flex items-center justify-center min-h-screen">
        <Loader size="lg" text="Loading wax details..." />
      </div>
    );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM4YjVjZjYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJWMTZoMnYxOHptLTQgMGgtMlYxNmgydjE4em0tNCAwaDh2LTJoOHYyem0wLTRIOHYtMmg4djJ6bTAtNEg4di0yaDh2MnptMC00SDh2LTJoOHYyem0wLTRIOHYtMmg4djJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />

      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
      <div
        className="absolute bottom-20 right-20 w-96 h-96 bg-accent-pink rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"
        style={{ animationDelay: "2s" }}
      />

      <>
        {showAddCard && (
          <AddCardModal
            open={true}
            onClose={() => setShowAddCard(false)}
            onSuccess={refreshData}
          />
        )}
        {showBuyWax && (
          <BuyWaxModal
            open={true}
            onClose={() => setShowBuyWax(false)}
            onSuccess={refreshData}
          />
        )}
        {showAutoReload && data.autoReloadSettings && (
          <WaxAutoReloadSettingModal
            isOpen={true}
            onClose={() => setShowAutoReload(false)}
            initialData={data.autoReloadSettings}
            onSuccess={refreshData}
          />
        )}

        <div className="w-full flex justify-center min-h-full">
          <div className="w-full max-w-[1180px] flex flex-col items-center justify-start gap-4 p-5">
            <Container>
              <div className="flex flex-col gap-4 md:gap-2 md:flex-row md:items-start md:justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-[#F3F4F6] font-bold text-[25px]">
                    Wax balance
                  </h1>
                  <p className="text-[#91ACC8] text-[14px] font-normal">
                    Your wax balance will be used for various AI model tasks.
                    You can either add wax directly or set up automatic reload.
                  </p>
                </div>
                <Button
                  onClick={() => setShowBuyWax(true)}
                  variant="outline"
                  size="md"
                >
                  Add Wax
                </Button>
              </div>

              <div className="w-full grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
                <div className="flex flex-col items-center justify-center text-center h-[200px] bg-[#16202A] rounded-lg border border-[#304962] p-4 transition-colors">
                  <h2 className="text-[32px] font-bold text-[#F98B8D] mb-1">
                    {typeof data.remainingCredits === "number"
                      ? data.remainingCredits.toLocaleString()
                      : data.remainingCredits}
                  </h2>
                  <p className="text-[#F3F4F6] text-sm">Remaining Wax</p>
                </div>

                <div className="flex items-center w-full">
                  <div className="flex flex-col bg-[#16202A] rounded-lg border border-[#304962] p-4 transition-color w-full">
                    {!data.userCard ? (
                      <div className="flex flex-col items-start gap-4">
                        <span className="text-[#F3F4F6] text-sm">
                          Please add card to make any purchase.
                        </span>
                        <Button
                          onClick={() => setShowAddCard(true)}
                          variant="primary"
                          size="md"
                        >
                          Add Card
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="text-sm font-medium text-[#F3F4F6] min-w-[80px] mb-2">
                          Charged to
                        </span>
                        <div className="flex items-center gap-4 mb-5">
                          <div className="rounded-md border border-[#304962] px-3 pb-2.5">
                            <CardDetail card={data.userCard} title="" />
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-start gap-3">
                            <div className="text-sm text-[#F3F4F6]">
                              {data.autoReloadSettings?.autoReload ? (
                                <div className="flex items-center gap-1">
                                  <CheckCircle className="w-5 h-5 text-[#70FFE9]" />
                                  <span className="font-medium text-[#F3F4F6] pl-1">
                                    Auto reload is enabled.
                                  </span>{" "}
                                  We will reload{" "}
                                  <span className="font-bold">
                                    ${data.autoReloadSettings.reloadAmount}
                                  </span>{" "}
                                  worth of wax when your wax balance drops below{" "}
                                  <span className="font-bold">
                                    {data.autoReloadSettings.reloadThreshold?.toLocaleString()}
                                    .
                                  </span>
                                </div>
                              ) : (
                                <>
                                  <span className="font-medium text-[#F3F4F6]">
                                    Auto reload is disabled.
                                  </span>{" "}
                                  Turn it on to ensure you never run out of wax.
                                </>
                              )}
                            </div>
                          </div>
                          <Button
                            onClick={() => setShowAutoReload(true)}
                            variant="outline"
                            size="md"
                          >
                            Edit Settings
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </>
    </div>
  );
};
