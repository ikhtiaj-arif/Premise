import { useSelector } from "react-redux";
import { useGetPremiseUserPictureQuery } from "../../app/EndPoints/premisePoolApi";
import userIcon from "../../img/Icons/userImg.png";
import { URL } from "../utils";
import UserType from "./UserType";

const LikeCount = ({ like }) => {
  // console.log(like?.user);
  const likedUser = like?.user?.id;
  const firstName = like?.user?.first_name;
  const lastName = like?.user?.last_name;
  const email = like?.user?.email;
  const username = email.split("@")[0];
  const user = useSelector((state) => state?.user?.id);
  // console.log(like)

  const {
    data: profileImg,
    profileImgLoading,
    refetch: profileRefetch,
  } = useGetPremiseUserPictureQuery(likedUser);

  const proImgUrl = URL.concat(profileImg?.[0]?.profile_photo);

  return (
    <div>
      <a
        target="_blank"
        rel="noreferrer"
        // href={`${URL}/memberpage/#/user/${created_by?.id}`}

        href={
          likedUser === user
            ? `${URL}/memberpage/#/personaldetails`
            : `${URL}/memberpage/#/user/${likedUser}/personaldetails`
        }
      >
        <div className="flex gap-[16px] items-center my-[8px]">
          {profileImg?.[0]?.profile_photo ? (
            <img src={proImgUrl} className="w-8 h-8 rounded-full" alt="" />
          ) : (
            <img src={userIcon} className="w-8 h-8" alt="" />
          )}
          {firstName ? (
            <div className="flex items-center">
              <h4 className="notranslate text-[14px] font-[500] text-[#252525] hover:text-[#00c3ff]">
                {firstName} {lastName}
              </h4>
              <UserType
                type={like?.user?.centraldatabase?.type}
                user_type={like?.user?.centraldatabase?.user_type}
              />
            </div>
          ) : (
            <div className="flex items-center">
              <h4 className="text-[14px] font-[500] text-[#252525]">
                {username}
              </h4>
              <UserType
                type={like?.user?.centraldatabase?.type}
                user_type={like?.user?.centraldatabase?.user_type}
              />
            </div>
          )}
        </div>
        <div className="h-[1px] bg-[#EAEAEA] w-full " />
      </a>
    </div>
  );
};

export default LikeCount;
