import { InfinitySpin } from "react-loader-spinner";
import React from 'react'

const LoadingScreen = () => {
    return (
        <div>
            <div className="modal-overlay">
                <div
                    className="spinner-container"
                >
                    <InfinitySpin
                        visible={true}
                        width="200"
                        ariaLabel="infinity-spin-loading"
                        color="rgba(73, 76, 212, 1)"
                    />
                </div>
            </div>
        </div>
    )
}

export default LoadingScreen
