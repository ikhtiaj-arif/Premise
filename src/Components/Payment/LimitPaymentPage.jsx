import CryptoJS from "crypto-js";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserAccess, MyContext } from "../../App";
import {
  useCallbackPackageMutation,
  usePayNowPackageMutation,
  useTopPayDetailsMutation,
} from "../../app/EndPoints/premisePoolApi";
import TypingLoader from "../TypingLoader";
import { CreditAmount } from "./CreditAmount";
import { CreditHeader } from "./CreditHeader";
import { CreditPackage } from "./CreditPackege";
import ShowAlertPop from "./ShowAlertPop";

const LimitPaymentPage = () => {
  const { counts, setCounts, currentUser, scriptId } = useContext(MyContext);
  // const [paymentUintDetails, { isLoading: isPLoading }] =
  //   usePaymentUintDetailsMutation();

  const [paymentUintDetails, { isLoading: isPLoading }] =
    useTopPayDetailsMutation();

  const [payNow, { isLoading: isPayLoading }] = usePayNowPackageMutation();
  const [successFulPayment, { isLoading: isSPayLoading }] =
    useCallbackPackageMutation();
  const id = useParams();
  const [paymentData, setPaymentData] = useState();

  const [isAgreementChecked, setAgreementChecked] = useState(false);
  const [paymentCondition, setPaymentCondition] = useState(false);
  const [paymentConditionPop, setPaymentConditionPop] = useState(null);

  const navigate = useNavigate();

  //console.log("scriptid from limit payment", scriptId);

  useEffect(() => {
    async function fetchData() {
      // const servicesData = Object.entries(counts).map(([key, value]) => ({
      //   service_name: key,
      //   service_count: parseFloat(value),
      // }));
      // const data = {
      //   services_data: servicesData,
      // };
      const data = {
        dollar_amount: counts,
      };
      try {
        const res = await paymentUintDetails(data);
        console.log("payment res", res?.data);
        setPaymentData(res?.data);
      } catch (error) {
        console.error("payment Error:", error);
      }
    }
    if (counts > 0) {
      fetchData();
    } else {
      navigate(`/${id?.id}`);
    }
  }, [counts]);

  const handlePaymentSuccess = async (response, isPayU = false) => {
    if (response) {
      const data = {
        dollar_amount: paymentData?.pricing_details?.base_usd,
      };
      if (isPayU) {
        // PayU-specific data mapping
        data.payu_payment_id = response?.tnxid;
        data.payu_hash = response?.hash;
      } else {
        // Razorpay-specific data mapping
        data.razorpay_order_id = response?.razorpay_order_id;
        data.razorpay_payment_id = response?.razorpay_payment_id;
        data.razorpay_signature = response?.razorpay_signature;
      }
      const creditToDebit = sessionStorage.getItem("creditToDebit");
      if (creditToDebit) {
        data.credit_to_debit = creditToDebit;
      }
      const res = await successFulPayment(data);
      if (res) {
        console.log("callback success", res);
        sessionStorage.removeItem("limit_counts");
        setCounts(null);
        const crdRes = await fetchUserAccess(`PP_AllowBrainstoming`);
        const remainingCredits = crdRes?.remaining_credits ?? 0;
        const creditElement = document.getElementById("creditBalance");
        if (creditElement) {
          creditElement.textContent = remainingCredits;
        }
        // navigate(`/${scriptId}`);
      }
    }
  };

  function loadRazorpayScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      console.log(script);

      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  const handleClick = async () => {
    if (!isAgreementChecked) {
      setPaymentConditionPop("You must agree to the terms of payment..!");
      //alert("You must agree to the terms of payment..!");
      return;
    }
    setPaymentCondition(true);
    const data = {
      // product_name: "pitchdeck",
      // charges: paymentData?.net_payable,
      // discount: 0,
      // services_data: paymentData?.services,
      // services_id: scriptId,
      dollar_amount: paymentData?.pricing_details?.final_payable_usd,
    };
    const result = await payNow(data);
    const { merchantId, amount, currency, orderId, credit_to_debit } =
      result?.data;
    console.log("topup", result);
    if (result) {
      sessionStorage.setItem("creditToDebit", credit_to_debit || "");
    }

    if (orderId) {
      const res = await loadRazorpayScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );
      setPaymentCondition(false);
      if (!res) {
        setPaymentConditionPop(
          "Razorpay SDK failed to load. please check are you online?"
        );
        //alert("Razorpay SDK failed to load. please check are you online?");
        return;
      }

      // console.log(res, "res");
      const options = {
        key: merchantId,
        amount: amount.toString(),
        currency: currency,
        name: "My Next Film",
        description: "Pitchdeck payments",
        handler: handlePaymentSuccess,
        order_id: orderId,
        redirect: true,
        notes: {
          address: "None",
        },
        theme: {
          color: "#00c3ff",
        },
        image: "https://uidemos.s3.ap-south-1.amazonaws.com/mnf_logo.png",
        credit_to_debit,
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } else {
      const tnxId = result?.data?.tnxid;
      const merchantKey = result?.data?.merchant_key;
      const amount = result?.data?.amount;
      // const amount = 1;
      const productInfo = result?.data?.productinfo;
      const userFirstName = result?.data?.username;
      const userEmail = result?.data?.email;
      const paymentSalt = result?.data?.merchant_salt;
      const sUrl = result?.data?.surl;
      const fUrl = result?.data?.furl;
      // console.log(
      //   "Payment",
      //   tnxId,
      //   merchantKey,
      //   amount,
      //   productInfo,
      //   userFirstName,
      //   userEmail,
      //   paymentSalt,
      //   sUrl,
      //   fUrl
      // );
      // Generate Hash String
      const hashString = `${merchantKey}|${tnxId}|${amount}|${productInfo}|${userFirstName}|${userEmail}|||||||||||${paymentSalt}`;
      const hash = CryptoJS.SHA512(hashString).toString(CryptoJS.enc.Hex);

      // Dynamically create and submit the form
      const payuForm = document.createElement("form");
      payuForm.action = "https://secure.payu.in/_payment";
      payuForm.method = "POST";

      // Add form fields
      payuForm.innerHTML = `
           <input type="hidden" name="key" value="${merchantKey}" />
           <input type="hidden" name="hash" value="${hash}" />
           <input type="hidden" name="txnid" value="${tnxId}" />
           <input type="hidden" name="surl" value="${sUrl}" />
           <input type="hidden" name="furl" value="${fUrl}" />
           <input type="hidden" name="firstname" value="${userFirstName}" />
           <input type="hidden" name="email" value="${userEmail}" />
           <input type="hidden" name="amount" value="${amount}" />
           <input type="hidden" name="productinfo" value="${productInfo}" />
         `;
      document.body.appendChild(payuForm);
      //console.log('payu form',payuForm);
      payuForm.submit();
      document.body.removeChild(payuForm);
    }
  };
  const getFormattedDate = () => {
    const today = new Date();
    const options = { year: "numeric", month: "long", day: "numeric" }; // Format: January 28, 2025
    return today.toLocaleDateString(undefined, options);
  };

  return (
    <div className="w-[100%] xl:w-[1140px] bottom-1 mx-auto lg:my-12">
      {isPLoading ? (
        // <Loader />
        <div className="h-[500px]">
          <TypingLoader />
        </div>
      ) : (
        <section className="lg:border-2 lg:border-[#eaeaea] w-full  max-w-[1130px] mx-auto ">
          <CreditHeader paymentData={paymentData} />

          <div className="p-4 md:border-b md:border-t border-b-[#0000001A] border-t-[#0000001A]">
            {/* Package Details Section */}
            <CreditPackage paymentData={paymentData} />

            {/* Amount Payable Section */}
            <CreditAmount paymentData={paymentData} />
          </div>

          <div className=" m-4">
            <div className=" text-left flex gap-1 items-center">
              <input
                checked={isAgreementChecked}
                onChange={() => setAgreementChecked(!isAgreementChecked)}
                type="checkbox"
                id="terms"
              />
              <label htmlFor="terms" className=" text-[16px] font-[400]">
                I Agree with the{" "}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`https://www.mnf.ai/terms-and-conditions`}
                  className="text-secondary "
                >
                  Terms of Payment
                </a>
              </label>
            </div>
          </div>


            {/* pay button */}
            <div className=" text-center m-4">
              <button
                disabled={paymentCondition}
                onClick={handleClick}
                className=" my-8 h-[46px] text-white bg-gradient-to-r from-[#741CFF] to-[#00c3ff] w-full font-[500] text-[14px] hover:shadow-md transition rounded-lg "
              >
                Pay Now
              </button>
            </div>
        </section>
      )}
      {paymentConditionPop && (
        <ShowAlertPop
          title={paymentConditionPop}
          setPaymentConditionPop={setPaymentConditionPop}
        />
      )}
    </div>
  );
};

export default LimitPaymentPage;
