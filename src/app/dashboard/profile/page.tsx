import ProfileContainer from "@/components/profile/ProfileContainer";
import { i18nTitle } from "@/lib/metadata";
import { myGetLocale } from "@/lib/locale";

export async function generateMetadata() {
  return await i18nTitle(await myGetLocale(), "profile");
}

function Profile() {
  return (
    <div className="col-span-3">
      <ProfileContainer />
    </div>
  );
}

export default Profile;
