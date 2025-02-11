import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import TypingLoader from "../TypingLoader";
import logo from "../../img/MNF_Logo_Final.png";
import Valid from "../../img/valid_upto.png";

import { HeaderOptions } from "./HeaderOptions";
import { Package } from "./Package";
import { Amount } from "./Amount";
import {
  usePaymentDataMutation,
  usePaymentSendMutation,
  usePaymentSucessMutation,
} from "../../app/EndPoints/premisePoolApi";
import { toast } from "react-toastify";

const PaymentPage = ({typeOfRequest,submit,setPayment,user,premise_id}) => {

  const [paymentData, { isLoading: isPLoading }] = usePaymentDataMutation();
  const [paymentSend] = usePaymentSendMutation();
  const [successFulPayment] = usePaymentSucessMutation();

  const [payInfo, setPayInfo] = useState();

  const [isAgreementChecked, setAgreementChecked] = useState(false);
  const [paymentCondition, setPaymentCondition] = useState(false);

  const navigate = useNavigate();

  console.log("payment", user);
  console.log("payInfo", payInfo);

  useEffect(() => {
    async function fetchData() {
      const formBody = new FormData();
      formBody.append("premise_id", premise_id);
      formBody.append("typeofrequest ", typeOfRequest);
      try {
        const res = await paymentData(formBody);
        console.log("payment get res", res);
        if (res?.data) {
          setPayInfo(res?.data);
        }
      } catch (error) {
        console.error("Error in payment get:", error);
        toast.error("Error in payment get. Please try again.");
      }
    }
    if (premise_id) {
      fetchData();
    }
  }, [premise_id, paymentData]);

  const handlePaymentSuccess = async (response, isPayU = false) => {
    if (response) {
      const data = {
        services_data: paymentData?.services,
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
        setPayment(true);
        toast("Payment Successful");
        if (submit) {
          submit();
        }
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
      alert("You must agree to the terms of payment..!");
      return;
    }
    setPaymentCondition(true);
    const data = {
      product_name: "Premisepool",
      amount: paymentData?.net_payable,
      transaction_id: premise_id,
    };
    const result = await paymentSend(data);
    const { merchantId, amount, currency, orderId, credit_to_debit } =
      result?.data;
    if (result) {
      sessionStorage.setItem("creditToDebit", credit_to_debit || "");
    }

    if (orderId) {
      const res = await loadRazorpayScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );
      setPaymentCondition(false);
      if (!res) {
        alert("Razorpay SDK failed to load. please check are you online?");
        return;
      }

      // console.log(res, "res");
      const options = {
        key: merchantId,
        amount: amount.toString(),
        currency: currency,
        name: "My Next Film",
        description: "Premisepool payments",
        handler: handlePaymentSuccess,
        order_id: orderId,
        redirect: true,
        notes: {
          address: "None",
        },
        theme: {
          color: "#33b0ca",
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
      //payuForm.action = "https://test.payu.in/_payment";
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
          <div className=" flex justify-between py-2 px-6 items-center border-b-2">
            {/* left */}
            <img
              src={logo}
              alt="brand logo"
              className="logo h-[99px] bg-white"
            />
            {/* right */}
            <div>
              <h2 className="sub-heading text-light-blue font-bold text-sm sm:text-lg md:text-2xl py-2">
                My Next Film Pvt. Ltd.
              </h2>
              <p>CIN - U92419DL2021PTC381570</p>
              <a href="https://mynextfilm.ai/">www.mynextfilm.ai</a>
            </div>
          </div>

          <div className="sm:m-12 m-4">
            <div className="flex justify-between">
              <section className="flex flex-col justify-center w-[90%] mx-auto">
                <p className="text-light-blue text-lg sm:text-xl md:text-2xl lg:text-3xl  xl:text-4xl font-semibold pb-3">
                  Invoice
                </p>
                <p
                  id="date"
                  className="border-b-2 border-t-2 text-lg border-[#ccc]  px-4 py-2 w-64"
                >
                  {getFormattedDate()}
                </p>
                <HeaderOptions
                  currentUser={user}
                  limitBridgePaymentData={payInfo}
                />
              </section>
              <div className=" ">
                <img src={Valid} className="w-[107px]" alt="" />
              </div>
            </div>

            <section className="flex flex-col lg:flex-row justify-between lg:gap-[5rem] gap-[20px] h-full">
              <Package limitBridgePaymentData={payInfo?.services} />

              <Amount limitBridgePaymentData={payInfo} />
            </section>

            {/* terms part */}
            <div className="mt-2">
              <div className=" text-left flex gap-1">
                <input
                  checked={isAgreementChecked}
                  onChange={() => setAgreementChecked(!isAgreementChecked)}
                  type="checkbox"
                  id="terms"
                />
                <label htmlFor="terms">
                  I agree with the{" "}
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`https://mynextfilm.ai/templates/Tnc.html`}
                    className="text-[#5a83ef] underline"
                  >
                    Terms of Payment
                  </a>
                </label>
              </div>
              <div></div>
            </div>

            {/* pay button */}
            <div className=" text-center">
              <button
                disabled={paymentCondition}
                onClick={handleClick}
                className="w-32 my-8 h-[40px] bg-[#33b0ca] text-white rounded-lg font-semibold"
              >
                Pay Now
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default PaymentPage;
