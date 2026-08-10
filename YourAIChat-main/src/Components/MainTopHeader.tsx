import menuIcon from "../assets/svgs/menu.svg";
import type { MainTopHeaderProps } from "../utils/propsType";
export default function MainTopHeader({ onToggle }: MainTopHeaderProps) {
  return (
    <>
      <div className="mainTopHeader">
        <div className="topHeaderLeft">
          <img src={menuIcon} alt="menu icon" onClick={onToggle}/>
          <span>Fast Chat 3.0</span>
        </div>
        <div className="topHeaderRight">
          <div className="onlineLogoOuter">
            <div className="onlineLogoInner"></div>
          </div>
          <span>Online</span>
        </div>
      </div>
    </>
  );
}
