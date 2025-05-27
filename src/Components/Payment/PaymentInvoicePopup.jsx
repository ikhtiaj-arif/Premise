import CryptoJS from "crypto-js";
import React, { useContext, useEffect, useState } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MyContext } from "../../App";
import {
  usePaymentDataMutation,
  usePaymentSendMutation,
  usePaymentSucessMutation,
} from "../../app/EndPoints/premisePoolApi";
import crossIcon from "../../img/croos_icon.png";
import logo from "../../img/MNF_Logo_Final.png";
import Valid from "../../img/valid_upto.png";
import TypingLoader from "../TypingLoader";
import { Amount } from "./Amount";
import { HeaderOptions } from "./HeaderOptions";
import { Package } from "./Package";
import SimpleAlertPop from "../PremiseV2/Popups/alerts/SimpleAlertPop";
import SameNamePop from "../PremiseV2/Popups/alerts/SameNamePop";
import { URL } from "../utils";

const PaymentInvoicePopup = ({
  refetch,
  typeOfRequest,
  submit,
  setPayment,
  premise_id,
  popClose,
}) => {
  const { currentUser, projectRefetch } = useContext(MyContext);
  const [paymentData, { isLoading: isPLoading }] = usePaymentDataMutation();
  const [paymentSend] = usePaymentSendMutation();
  const [successFulPayment] = usePaymentSucessMutation();

  const [payInfo, setPayInfo] = useState();

  const [isAgreementChecked, setAgreementChecked] = useState(false);
  const [paymentCondition, setPaymentCondition] = useState(false);

  const navigate = useNavigate();

  //   console.log("payment", user);
  //   console.log("payInfo", payInfo);

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
    // console.log("payment success", response, payInfo);
    if (response) {
      const data = {
        services_data: payInfo?.services,
      };
      if (isPayU) {
        data.payu_payment_id = response?.tnxid;
        data.payu_hash = response?.hash;
      } else {
        data.razorpay_order_id = response?.razorpay_order_id;
        data.razorpay_payment_id = response?.razorpay_payment_id;
        data.razorpay_signature = response?.razorpay_signature;
        data.transaction_id = payInfo?.transaction_id;
        data.premise_id = payInfo?.premise_id;
        data.total_amount = payInfo?.total_amount;
      }
      const creditToDebit = sessionStorage.getItem("creditToDebit");
      if (creditToDebit) {
        data.credit_to_debit = creditToDebit;
      }
      const res = await successFulPayment(data);
      if (res) {
        console.log("callback success", res);
        if (submit) {
          submit(payInfo?.transaction_id);
        }
        popClose(null);
        setPayment(null);
        toast("Payment Successful");
        setPaymentCondition(false);
        projectRefetch();
        refetch();
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
  const [termAlert, setTermAlert] = useState(false);
  const handleClick = async () => {
    if (!isAgreementChecked) {
      // alert("You must agree to the terms of payment..!");
      setTermAlert(true);
      return;
    }
    setPaymentCondition(true);
    const data = {
      transaction_id: premise_id,
      product_name: "Premisepool",
      charges: payInfo?.net_payable || 0,
      discount: 0,
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
      console.log(
        "Payment",
        tnxId,
        merchantKey,
        amount,
        productInfo,
        userFirstName,
        userEmail,
        paymentSalt,
        sUrl,
        fUrl
      );
      // Generate Hash String
      const hashString = `${merchantKey}|${tnxId}|${amount}|${productInfo}|${userFirstName}|${userEmail}|||||||||||${paymentSalt}`;
      const hash = CryptoJS.SHA512(hashString).toString(CryptoJS.enc.Hex);

      // Dynamically create and submit the form
      const payuForm = document.createElement("form");
      payuForm.action = "https://secure.payu.in/_payment";
      // payuForm.action = "https://test.payu.in/_payment";
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
    //setPaymentCondition(false);
  };
  const getFormattedDate = () => {
    const today = new Date();
    const options = { year: "numeric", month: "long", day: "numeric" }; // Format: January 28, 2025
    return today.toLocaleDateString(undefined, options);
  };

  return (
    <div className="fixed top-[40px] left-0 w-full h-full flex items-center justify-center bg-[#252525b0] z-[2]">
      <div className="h-[90vh] lg:static lg:mt-0 absolute bottom-0 bg-white md::rounded-[12px] w-[100%] lg:w-[1140px]">
        <div className="relative">
          <div className="hidden md:block absolute right-[45%] top-[-60px] md:top-[-62px] md:right-[-12px]">
            <img
              src={crossIcon}
              alt=""
              className="w-[40px] h-[40px] z-[9] cursor-pointer"
              onClick={() => {
                setPayment(false);
              }}
            />
          </div>
          <div className="md:hidden absolute top-[-38px] left-[-18px] ml-4 sm:ml-0 sm:right-[-15px]">
            <MdKeyboardBackspace
              alt=""
              className="text-[#33B0CA] ml-[20px] text-left text-[38px] z-[1] absolute cursor-pointer mdHidden"
              onClick={() => {
                setPayment(false);
              }}
            />
          </div>

          <div className="w-[100%] h-[80vh]  overflow-y-auto bottom-1 mx-auto my-12">
            {isPLoading ? (
              // <Loader />
              <div className="h-full">
                <TypingLoader />
              </div>
            ) : (
              <section className="border-2 border-[#eaeaea] w-full mx-auto ">
                <div className=" flex justify-between py-1 sm:py-2 px-6 items-center md:border-none border-b-2">
                  {/* left */}
                  <img
                    src={logo}
                    alt="brand logo"
                    className="logo sm:w-[116px] w-[50px] sm:h-[99px] bg-white"
                  />
                  {/* right */}
                  <div className=" text-right">
                    <h2 className="text-[#33B0CA] text-light-blue font-bold text-sm sm:text-lg md:text-2xl py-2">
                      My Next Film Pvt. Ltd.
                    </h2>
                    <p className="text-[12px]  sm:text-[14px]">
                      CIN - U92419DL2021PTC381570
                    </p>
                    <a
                      className="text-[12px]  sm:text-[14px]"
                      href={`${URL}`}
                    >
                      www.mnf.ai
                    </a>
                  </div>
                </div>

                <div className="md:mx-12 md:my-2 m-4">
                  <div className=" grid grid-cols-2 md:grid-cols-[40%_minmax(40%,_1fr)_20%] text-[#33B0CA] text-[16px] md:text-[28px] font-bold md:mb-6">
                    <h2>
                      Order Summary{" "}
                      {/* <span className="text-[16px] md:text-[24px]">{`2025/001`}</span>
                      <p
                        id="date"
                        className="border-b-2 border-t-2 sm:text-lg border-[#ccc]  px-4 py-2 w-24 hidden md:block mt-1"
                      ></p> */}
                    </h2>
                    <p className=" hidden md:flex"></p>
                    <div className="flex  md:hidden w-[36px] h-[47px] ml-auto ">
                      <img
                        src={Valid}
                        className="w-full h-full ml-auto"
                        alt=""
                      />
                    </div>
                  </div>

                  <div className=" grid grid-cols-1 md:grid-cols-[40%_minmax(40%,_1fr)_20%] items-start gap-2">
                    <HeaderOptions mnf />
                    <HeaderOptions currentUser={currentUser} data={payInfo} />
                    <div className=" hidden md:flex w-[100px] h-[150px] ml-auto mr-4">
                      <img
                        src={Valid}
                        className="w-full h-full ml-auto"
                        alt=""
                      />
                    </div>
                  </div>

                  <section className="flex flex-col lg:flex-row justify-between lg:gap-[5rem] gap-[20px] h-full">
                    <Package data={payInfo} typeOfRequest={typeOfRequest} />

                    <Amount
                      data={payInfo}
                      {...{ isAgreementChecked, setAgreementChecked }}
                    />
                    {/* <PayableAmount
                      data={payInfo}
                      typeOfRequest={typeOfRequest}
                    /> */}
                  </section>

                  {/* pay button */}
                  <div className=" text-center">
                    <button
                      disabled={paymentCondition}
                      onClick={handleClick}
                      className={`${
                        paymentCondition ? "bg-[#ACDDE7]" : "bg-[#33b0ca] "
                      } w-32 my-8 h-[40px] text-white  rounded-lg font-semibold`}
                    >
                      {paymentCondition ? "Processing" : "Pay Now"}
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
      {termAlert && (
        <SameNamePop popClose={setTermAlert} title={`You must agree to the terms of payment..!`} />
      )}
    </div>
  );
};

export default PaymentInvoicePopup;
