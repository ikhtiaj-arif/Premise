import { useSelector } from "react-redux";
import {
  useGetPremiseUserPictureQuery,
  useGetUserByUserIdQuery,
} from "../../app/EndPoints/premisePoolApi";
import userIcon from "../../img/Icons/userImg.png";
import { baseURL } from "../utils";

const ReplyLikeEachPop = ({ like }) => {
  //   const likedUser = like?.id;
  const user = useSelector((state) => state?.user?.id);

  const {
    data: userData,
    userLoading,
    refetch: userRefetch,
  } = useGetUserByUserIdQuery(like);

  const {
    data: profileImg,
    profileImgLoading,
    refetch: profileRefetch,
  } = useGetPremiseUserPictureQuery(like);
  const proImgUrl = baseURL.concat(profileImg?.[0]?.profile_photo);

  return (
    <div>
      <a
        // target="_blank"
        rel="noreferrer"
        // href={`${URL}/memberpage/#/user/${created_by?.id}`}

        href={
          userData?.user_id === user
            ? `${baseURL}/memberpage/#/personaldetails`
            : `${baseURL}/memberpage/#/user/${userData?.user_id}/personaldetails`
        }
      >
        <div className="flex gap-[16px] items-center mb-1">
          {profileImg?.[0]?.profile_photo ? (
            <img
              src={proImgUrl}
              className="h-[31.9px] w-[32px] mt-[6px] rounded-full object-cover border border-[#eaeaea]"
              alt=""
            />
          ) : (
            <img
              src={userIcon}
              className="h-[31.9px] w-[32px] mt-[6px]"
              alt=""
            />
          )}
          {userData?.firstName ? (
            <div className="flex items-center">
              <h4 className="text-[14px] font-[500] text-[#252525] hover:text-[#00c3ff]">
                {userData?.firstName} {userData?.lastName}
              </h4>
              {/* <UserType type={userData?.type} user_type={userData?.user_type} /> */}
            </div>
          ) : (
            <div className="flex items-center">
              <h4 className="text-[14px] font-[500] text-[#252525]">
                {userData?.email?.split("@")[0]}
              </h4>
              {/* <UserType type={userData?.type} user_type={userData?.user_type} /> */}
            </div>
          )}
        </div>
        <div className="h-[2px] bg-[#EAEAEA] w-full " />
      </a>
    </div>
  );
};

export default ReplyLikeEachPop;
