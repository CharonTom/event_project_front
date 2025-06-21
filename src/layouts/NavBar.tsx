import { NavLink } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";

export default function Navbar() {
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    isActive ? "text-primary" : "text-[#6D6D6D]";

  return (
    <div className="fixed bottom-0 left-0 w-full bg-grey-bg shadow py-4 px-4 flex justify-center z-50">
      <div className="mx-auto w-full max-w-2xl px-4">
        <nav className="flex w-full">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center text-center transition-colors ${linkClasses(
                { isActive }
              )}`
            }
          >
            <svg
              width="25"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.52 2.83992L4.13 7.03992C3.23 7.73992 2.5 9.22992 2.5 10.3599V17.7699C2.5 20.0899 4.39 21.9899 6.71 21.9899H18.29C20.61 21.9899 22.5 20.0899 22.5 17.7799V10.4999C22.5 9.28992 21.69 7.73992 20.7 7.04992L14.52 2.71992C13.12 1.73992 10.87 1.78992 9.52 2.83992Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path d="M12.5 17.99V14.99V17.99Z" fill="currentColor" />
              <path
                d="M12.5 17.99V14.99"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <p className="text-[10px] mt-1">Accueil</p>
          </NavLink>

          <NavLink
            to="/search-map"
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center text-center transition-colors ${linkClasses(
                { isActive }
              )}`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
            >
              <path
                d="M12 21C17.2467 21 21.5 16.7467 21.5 11.5C21.5 6.25329 17.2467 2 12 2C6.75329 2 2.5 6.25329 2.5 11.5C2.5 16.7467 6.75329 21 12 21Z"
                stroke="CurrentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M22.5 22L20.5 20"
                stroke="CurrentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <p className="text-[10px] mt-1">Rechercher</p>
          </NavLink>

          <NavLink
            to="/account"
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center text-center transition-colors ${linkClasses(
                { isActive }
              )}`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
            >
              <path
                d="M12.5 12.5C15.2614 12.5 17.5 10.2614 17.5 7.5C17.5 4.73858 15.2614 2.5 12.5 2.5C9.73858 2.5 7.5 4.73858 7.5 7.5C7.5 10.2614 9.73858 12.5 12.5 12.5Z"
                fill="CurrentColor"
              />
              <path
                d="M12.5 15.5C17.3284 15.5 21.0898 18.722 21.0898 22.5H3.91016C3.91016 18.7221 7.67167 15.5001 12.5 15.5Z"
                fill="CurrentColor"
                stroke="CurrentColor"
              />
            </svg>
            <p className="text-[10px] mt-1">Profil</p>
          </NavLink>
          <NavLink
            to="/calendar"
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center text-center transition-colors ${linkClasses(
                { isActive }
              )}`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                opacity="0.4"
                d="M6.08812 2.05957V3.76855H6.07055C5.4165 3.82092 4.77359 3.96361 4.16527 4.19531C2.5723 4.84037 1.85675 6.09957 1.85668 8.12207V8.58691H0.00902304V8.12695C-0.0721787 6.6756 0.396759 5.24301 1.33227 4.08105L1.34984 4.06641C1.44245 3.96392 1.54302 3.86554 1.64477 3.75879L1.66234 3.74219C1.95046 3.47641 2.26941 3.24259 2.61352 3.04297C2.68092 3.0067 2.74046 2.96748 2.80785 2.93652L3.03637 2.81738C3.129 2.77787 3.22986 2.73092 3.3225 2.69141C3.3899 2.66794 3.45725 2.63677 3.52465 2.61328C3.6516 2.56522 3.78715 2.51901 3.92211 2.47949C3.96782 2.45922 4.01554 2.44232 4.06469 2.43164C4.10006 2.41566 4.13675 2.40853 4.17895 2.39258V2.39941C4.79427 2.22747 5.4273 2.11288 6.06664 2.06055V2.05176L6.08812 2.05957ZM17.9475 2.05664C18.5868 2.11004 19.2197 2.22259 19.8362 2.39453V2.38574C19.8727 2.40065 19.9002 2.40979 19.9504 2.42578C20.0006 2.44176 20.0428 2.45774 20.093 2.47266C20.2268 2.51216 20.3515 2.55937 20.4807 2.60742C20.555 2.6309 20.6236 2.66206 20.6819 2.68555C20.7825 2.72506 20.8857 2.77201 20.968 2.81152C21.0525 2.85095 21.1335 2.89449 21.2043 2.92969C21.2751 2.96486 21.3305 3.00413 21.3899 3.03613C21.7353 3.23692 22.0582 3.47253 22.3498 3.73633L22.3596 3.75195C22.4671 3.84913 22.5694 3.95172 22.6643 4.05957L22.6721 4.07422C23.6065 5.23719 24.0727 6.67076 23.9905 8.12207V8.58691H22.1448V8.11035C22.1836 7.25394 21.9929 6.40176 21.5881 5.63184C21.1993 4.97288 20.5769 4.46127 19.8254 4.18359C19.2273 3.95186 18.5937 3.8081 17.9475 3.75684V2.05664ZM16.1204 3.69727H7.92992V1.98145H16.1204V3.69727Z"
                fill="currentColor"
              />
              <path
                d="M18.0001 0.860072V4.64192C18.0001 5.11843 17.5705 5.50438 17.0401 5.50438C16.5097 5.50438 16.0801 5.11843 16.0801 4.64192V0.868697C16.0753 0.392192 16.5025 0.0030104 17.0329 -0.000223792C17.5633 -0.00345799 17.9965 0.379255 18.0001 0.85576V0.860072Z"
                fill="currentColor"
              />
              <path
                d="M7.91999 0.873821V4.64632C7.91999 5.12489 7.48988 5.51292 6.9594 5.51292C6.42892 5.51292 6 5.12489 6 4.64632V0.873821C6 0.395252 6.42892 0.00830078 6.9594 0.00830078C7.48988 0.00830078 7.91999 0.395252 7.91999 0.873821Z"
                fill="currentColor"
              />
              <path
                d="M24 8.58691V17.8916C24 21.9493 21.4821 24 16.4922 24H7.49609C2.51777 23.9999 0 21.9492 0 17.8916V8.58691H24ZM6.51172 17.085C5.89391 17.0852 5.40164 17.5524 5.41309 18.1152C5.4133 18.6779 5.90548 19.1345 6.51172 19.1348C7.11819 19.1348 7.61017 18.6673 7.61035 18.1045C7.61031 17.5415 7.11827 17.085 6.51172 17.085ZM11.9941 17.085C11.3877 17.0957 10.8955 17.5523 10.8955 18.1152C10.8957 18.678 11.3995 19.1347 12.0059 19.1348C12.6122 19.1347 13.1043 18.6779 13.1045 18.1045C13.093 17.5522 12.6123 17.0957 12.0059 17.085H11.9941ZM17.4766 17.0957C16.8701 17.0958 16.3779 17.5523 16.3779 18.1152C16.3895 18.6779 16.8811 19.1345 17.4873 19.1348C18.0938 19.1348 18.5858 18.6781 18.5859 18.1152C18.5859 17.5523 18.0939 17.0957 17.4873 17.0957H17.4766ZM6.51172 12.7295C5.90554 12.7298 5.41334 13.1971 5.41309 13.7598C5.41326 14.3224 5.9055 14.78 6.51172 14.7803C7.12948 14.7803 7.62137 14.3127 7.61035 13.75C7.61035 13.187 7.11857 12.7295 6.52344 12.7295H6.51172ZM11.9941 12.7295C11.3878 12.7402 10.8957 13.197 10.8955 13.7598C10.8957 14.3225 11.3995 14.7802 12.0059 14.7803C12.6122 14.7802 13.1043 14.3224 13.1045 13.749C13.1042 13.1969 12.6122 12.7402 12.0059 12.7295H11.9941ZM17.4873 12.7402C16.8695 12.7404 16.3889 13.197 16.3887 13.7598C16.3889 14.3225 16.881 14.7801 17.4873 14.7803C18.0938 14.7803 18.5858 14.3226 18.5859 13.7598C18.5857 13.1969 18.0938 12.7402 17.4873 12.7402Z"
                fill="currentColor"
              />
            </svg>
            <p className="text-[10px] mt-1">Agenda</p>
          </NavLink>
          <NavLink
            to="/setting"
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center text-center transition-colors ${linkClasses(
                { isActive }
              )}`
            }
          >
            <IoSettingsOutline className="text-2xl" />
            <p className="text-[10px] mt-1">Paramètres</p>
          </NavLink>
        </nav>
      </div>
    </div>
  );
}
