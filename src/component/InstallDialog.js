import styles from "../css/InstallDialog.module.css";

export default function InstallDialog({ isOpen, onClose }) {
  
  if (!isOpen) return null;

  return (
    <div className={styles.dialogOverlay} onClick={onClose}>
      <div
        className={styles.dialogContent}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={styles.dialogTitle}>iOS에서 앱 설치하기</h2>
        <p className={styles.dialogText}>
          이 앱을 홈 화면에 추가하려면 다음 단계를 따르세요:
        </p>
        <ol className={styles.dialogList}>
          <li>
            Safari 브라우저의 공유 버튼{" "}
            <span className={styles.iosIcon}>&#xf1e0;</span>을 탭하세요.
          </li>
          <li>&quot;홈 화면에 추가&quot; 옵션을 선택하세요.</li>
          <li>&quot;추가&quot;를 탭하여 완료하세요.</li>
        </ol>
        <div className={styles.dialogButtonContainer}>
          <button className={styles.dialogCloseButton} onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
