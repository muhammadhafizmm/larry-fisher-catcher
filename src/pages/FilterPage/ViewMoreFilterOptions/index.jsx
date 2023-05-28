import "./style.scss";
import BottomSheet from "../../../common/BottomSheet";

function ViewMoreFilterOption({
  title,
  isOpen,
  listData,
  handleChangeData,
  formatListData,
}) {
  return (
    <BottomSheet isOpen={isOpen}>
      <span className="view-more-title">{title}</span>
      <div className="view-more-content-list">
        {listData.map((value, idx) => {
          const string = formatListData(value);
          if (!string) return null;
          return (
            <div
              className="view-more-items-wrapper"
              key={`items_${string}_${title}_${idx}`}
              onClick={() => handleChangeData(value)}
            >
              <span className="view-more-items">{formatListData(value)}</span>
            </div>
          );
        })}
      </div>
    </BottomSheet>
  );
}

export default ViewMoreFilterOption;
