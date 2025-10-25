import CryptoJS from "crypto-js";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserAccess, MyContext } from "../../App";
import {
  useCallbackPackageMutation,
  usePayNowPackageMutation,
  useTopPayDetailsMutation,
} from "../../app/EndPoints/premisePoolApi";
import Valid from "../../img/valid_upto.webp";
import SameNamePop from "../PremiseV2/Popups/alerts/SameNamePop";
import TypingLoader from "../TypingLoader";
import { CreditAmount } from "./CreditAmount";
import { CreditHeader } from "./CreditHeader";
import { CreditPackage } from "./CreditPackege";
import { HeaderOptions } from "./HeaderOptions";

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
    <div className="w-[95%] xl:w-[1140px] bottom-1 mx-auto my-12">
      {isPLoading ? (
        // <Loader />
        <div className="h-[500px]">
          <TypingLoader />
        </div>
      ) : (
        <section className="border-2 border-[#eaeaea] w-full  max-w-[1130px] mx-auto ">
          <div className=" flex justify-between py-1 sm:py-2 px-6 items-center md:border-none border-b-2">
            {/* left */}
            <img
              src={`https://taj4o.mynextfilm.in/static/pricingnew/MNF_Beta_Dark.webp`}
              alt="brand logo"
              className="logo max-w-[186px] bg-white"
            />
            {/* right */}
            <div className=" text-right">
              <h2 className="sub-heading text-light-blue font-bold text-sm sm:text-lg md:text-2xl py-2">
                My Next Film Pvt. Ltd.
              </h2>
              <p className="text-[12px]  sm:text-[14px]">
                CIN - U92419DL2021PTC381570
              </p>
              <a className="text-[12px]  sm:text-[14px]" href="https://mnf.ai/">
                www.mnf.ai
              </a>
            </div>
          </div>
          <hr />

          <div className="md:mx-12 md:my-2 m-4">
            <div className=" grid grid-cols-2 md:grid-cols-[40%_minmax(40%,_1fr)_20%] text-[#00c3ff] text-[16px] md:text-[28px] font-bold md:mb-6">
              <h2>
                Order Summary{" "}
                {/* <span className="text-[16px] md:text-[24px]">{`2425/001`}</span>
                <p
                  id="date"
                  className="border-b-2 border-t-2 sm:text-lg border-[#ccc]  px-4 py-2 w-28 hidden md:block"
                ></p> */}
              </h2>
              <p className=" hidden md:flex"></p>
              <div className="flex  md:hidden w-[36px] h-[47px] ml-auto ">
                <img src={Valid} className="w-full h-full ml-auto" alt="" />
              </div>
            </div>

            <div className=" grid grid-cols-1 md:grid-cols-[40%_minmax(40%,_1fr)_20%] items-start gap-2">
              <HeaderOptions mnf />
              {/* <HeaderOptions
                currentUser={user}
                limitBridgePaymentData={paymentData?.user_details}
              /> */}
              <CreditHeader
                limitBridgePaymentData={paymentData}
                currentUser={currentUser}
              />
              <div className=" hidden md:flex w-[100px] h-[150px] ml-auto mr-4">
                <img src={Valid} className="w-full h-full ml-auto" alt="" />
              </div>
            </div>

            <section className="flex flex-col lg:flex-row justify-between lg:gap-[5rem] gap-[20px] h-full">
              <CreditPackage
                credit={paymentData?.conversion_info?.credits_to_add}
              />
              {/* <Package limitBridgePaymentData={paymentData?.services} /> */}

              <CreditAmount
                data={paymentData?.pricing_details}
                creditData={paymentData}
                {...{ isAgreementChecked, setAgreementChecked }}
              />
              {/* <Amount
                limitBridgePaymentData={paymentData}
                {...{ isAgreementChecked, setAgreementChecked }}
              /> */}
            </section>

            {/* pay button */}
            <div className=" text-center">
              <button
                disabled={paymentCondition}
                onClick={handleClick}
                className="w-32 my-8 h-[32px] bg-[linear-gradient(30deg,#741CFF,#00c3ff)] hover:shadow-md shadow-[#252525]  text-white rounded-lg font-semibold"
              >
                Pay Now
              </button>
            </div>
          </div>
        </section>
      )}
      {paymentConditionPop && (
        <SameNamePop
          title={paymentConditionPop}
          popClose={setPaymentConditionPop}
        />
      )}
    </div>
  );
};

export default LimitPaymentPage;
