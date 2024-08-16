import React from "react";
import { URL } from "../../utils";

const Footer = () => {
  return (
    // <div className="bg-[#ffe2e5] text-[#33B0CA] font-semibold static bottom-0 left-0 right-0 mt-5">
    //   <footer className="py-3 w-[95%] md:w-[80%] mx-auto flex flex-col md:flex-row md:justify-between gap-2 ">
    //     {/* Reversed order for mobile devices */}
    //     <div className="order-6 md:order-5 text-center">
    //       <p className="my-auto">&copy;2023 My Next Film PVT LTD</p>
    //     </div>
    //     <div className="flex flex-col sm:flex-row gap-3 order-5 md:order-6 text-center">
    //       <a href={`${URL}/agreement/`} target="_blank" rel="noreferrer">Agreement</a>
    //       <a href={`${URL}/tnc_base/`} target="_blank" rel="noreferrer">Terms & Conditions</a>
    //       <a href={`${URL}/PrivacyPolicy_base/`} target="_blank" rel="noreferrer">
    //         Privacy Policy
    //       </a>
    //       <a href={`${URL}/Refunds_base/`} rel="noreferrer" target="_blank">
    //         Refund & Cancellation Policy
    //       </a>
    //       <a href={`${URL}/NDA_base/`} rel="noreferrer" target="_blank">
    //         N.D.A
    //       </a>
    //     </div>
    //   </footer>
    // </div>

        <div className="bg-normalBg text-headingText bg-[#33B0CA] text-[16px] text-[#fafafa] font-[400] static bottom-0 left-0 right-0 mt-5">
          <footer className="py-2 w-[95%]  md:w-[80%] mx-auto flex flex-col md:flex-row md:justify-between gap-2 ">
            {/* Reversed order for mobile devices */}
            <div className="order-6 md:order-5 text-center">
              <p className="my-auto">&copy;2023 My Next Film PVT LTD</p>
            </div>
            <div className="flex flex-col underline sm:flex-row gap-3 order-5 md:order-6 text-center">
              <a href={`${URL}/agreement/`} target="_blank" rel="noreferrer">Agreement</a>
              <a href={`${URL}/tnc_base/`} target="_blank" rel="noreferrer">Terms & Conditions</a>
              <a href={`${URL}/PrivacyPolicy_base/`} target="_blank" rel="noreferrer">
                Privacy Policy
              </a>
              <a href={`${URL}/Refunds_base/`} rel="noreferrer" target="_blank">
                Refund & Cancellation Policy
              </a>
              <a href={`${URL}/NDA_base/`} rel="noreferrer" target="_blank">
                N.D.A
              </a>
            </div>
          </footer>
        </div>
      );
    
    
};

export default Footer;
