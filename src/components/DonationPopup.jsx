import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function DonationPopup() {
    const [mounted, setMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [show, setShow] = useState(false);

    useEffect(() => {
        setMounted(true);
        const hasClosed = sessionStorage.getItem("donationPopupClosed");
        if (!hasClosed) {
            const timer = setTimeout(() => {
                setIsVisible(true);
                setTimeout(() => setShow(true), 50);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    if (!mounted || !isVisible) return null;

    return createPortal(
        <div
            style={{
                position: "fixed",
                bottom: "24px",
                right: "24px",
                zIndex: 9999,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "24px",
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-lg)",
                width: "300px",
                boxShadow: "var(--shadow-lg)",
                color: "var(--text-primary)",
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                transform: show ? "translateY(0)" : "translateY(24px)",
                opacity: show ? 1 : 0,
                backdropFilter: "blur(12px)",
            }}
        >
            <button
                onClick={() => {
                    sessionStorage.setItem("donationPopupClosed", "true");
                    setShow(false);
                    setTimeout(() => setIsVisible(false), 500);
                }}
                style={{
                    position: "absolute",
                    top: "14px",
                    right: "14px",
                    padding: "6px",
                    color: "var(--text-muted)",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "50%",
                }}
                aria-label="닫기"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </button>

            <div style={{ width: "100%", marginBottom: "20px", backgroundColor: "var(--bg-tertiary)", borderRadius: "var(--radius-md)", display: "flex", justifyContent: "center", padding: "16px", border: "1px solid var(--border-color)" }}>
                <img
                    src={`${import.meta.env.BASE_URL?.endsWith('/') ? import.meta.env.BASE_URL : (import.meta.env.BASE_URL + '/')}donation-qr.png`}
                    alt="기부 QR 코드"
                    style={{ width: "150px", height: "150px", objectFit: "contain", opacity: 1 }}
                />
            </div>

            <div style={{ textAlign: "center", width: "100%" }}>
                <p style={{ fontSize: "13px", fontWeight: 800, lineHeight: 1.6, wordBreak: "keep-all", margin: "0", color: "var(--text-primary)" }}>
                    이 서비스가 도움이 되셨다면,<br />
                    커피 한 잔 값으로 응원해 주세요 ☕<br />
                    작은 기부가 큰 힘이 됩니다.
                </p>
            </div>
        </div>,
        document.body
    );
}
