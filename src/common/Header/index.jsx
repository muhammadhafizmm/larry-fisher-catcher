import "./style.scss";
import {ReactComponent as ArrowBackIcon} from "../../assets/svgs/arrow-back.svg"

function Header({
    handleOnBack,
    title
}) {
  return (
    <div className="header-container">
      <div className="header-main">
        <div className="back-button" onClick={() => handleOnBack && handleOnBack()}>
            <ArrowBackIcon/>
        </div>
        <div className="label">
            {title}
        </div>
      </div>
    </div>
  );
}

export default Header;
