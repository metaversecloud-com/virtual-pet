import { GlobalStateContext } from "@/context/GlobalContext";
import { getS3URL } from "@/utils";
import { useContext } from "react";

export const LevelsModal = ({ handleToggleShowLevelsModal }: { handleToggleShowLevelsModal: () => void }) => {
  const { petStatus } = useContext(GlobalStateContext);
  const { color, petType } = petStatus || { color: 0, petType: "dragon" };

  return (
    <div className="modal-container">
      <div className="modal grid gap-6">
        <img
          src={`${getS3URL()}/assets/${petType}/normal/baby-color-${color}.png`}
          alt="Pet"
          style={{
            width: "50px",
            margin: "auto",
          }}
        />
        <h5>Level 1 - 5</h5>
        <p>Baby</p>

        <hr />
        <img
          src={`${getS3URL()}/assets/${petType}/normal/teen-color-${color}.png`}
          alt="Pet"
          style={{
            width: "100px",
            margin: "auto",
          }}
        />
        <h5>Level 5 - 10</h5>
        <p>Teen</p>

        <hr />
        <img
          src={`${getS3URL()}/assets/${petType}/normal/adult-color-${color}.png`}
          alt="Pet"
          style={{
            width: "140px",
            margin: "auto",
          }}
        />
        <h5>Level 10+</h5>
        <p>Adult</p>

        <div className="actions">
          <button id="close" className="btn" onClick={handleToggleShowLevelsModal}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LevelsModal;
