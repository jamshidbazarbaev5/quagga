import React, { useState, useEffect, useRef } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

export const Scanner = () => {
    const [selectedDeviceId, setSelectedDeviceId] = useState('');
    const [videoInputDevices, setVideoInputDevices] = useState<MediaDeviceInfo[]>([]);
    const [result, setResult] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const codeReader = useRef(new BrowserMultiFormatReader());
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    console.log(result)

    useEffect(() => {
        const initializeDevices = async () => {
            try {
                const devices = await codeReader.current.listVideoInputDevices();
                setVideoInputDevices(devices);
                if (devices.length > 0) {
                    setSelectedDeviceId(devices[0].deviceId);
                }
            } catch (err) {
                console.error('Error listing video devices:', err);
            }
        };

        initializeDevices();

        return () => {
            codeReader.current.reset();
        };
    }, []);

    const handleStart = () => {
        setIsScanning(true);
        codeReader.current.decodeFromVideoDevice(
            selectedDeviceId,
            'video',
            (result, err) => {
                if (result) {
                    console.log(result);
                    setResult(result.text);
                    setShowSuccessModal(true);
                    setIsScanning(false);
                    codeReader.current.reset();
                }
                if (err) {
                    if (!(err instanceof NotFoundException)) {
                        console.error(err);
                        setResult(err.toString());
                    }
                }
            }
        );
    };

    const handleReset = () => {
        codeReader.current.reset();
        setResult('');
        setIsScanning(false);
    };

    const handleDeviceChange = (event:any) => {
        setSelectedDeviceId(event.target.value);
        if (isScanning) {
            handleReset();
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 p-4">
            <div className="max-w-md mx-auto">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <button
                        onClick={handleStart}
                        disabled={isScanning}
                        className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-400"
                    >
                        Start Scanner
                    </button>
                    <button
                        onClick={handleReset}
                        className="w-full py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
                    >
                        Reset
                    </button>
                </div>

                <div className="mb-4 relative aspect-video">
                    <video
                        id="video"
                        className="w-full h-full object-cover rounded-lg border-2 border-gray-300"
                    />
                </div>

                {videoInputDevices.length > 1 && (
                    <div className="mb-4">
                        <label htmlFor="sourceSelect" className="block mb-2 font-medium">
                            Select Camera:
                        </label>
                        <select
                            id="sourceSelect"
                            value={selectedDeviceId}
                            onChange={handleDeviceChange}
                            className="w-full p-3 border rounded-lg bg-white"
                        >
                            {videoInputDevices.map((device) => (
                                <option key={device.deviceId} value={device.deviceId}>
                                    {device.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="mb-4">
                    <label className="block mb-2 font-medium">Scanned Result:</label>
                    <pre className="p-4 bg-white rounded-lg border">
                        <code>{result}</code>
                    </pre>
                </div>
            </div>

            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h3 className="text-lg font-bold mb-2">Success!</h3>
                        <p className="mb-4">Code successfully scanned:</p>
                        <pre className="p-4 bg-gray-100 rounded-lg mb-4">
                            <code>{result}</code>
                        </pre>
                        <button
                            onClick={() => {
                                setShowSuccessModal(false);
                                setResult('');
                            }}
                            className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Scanner;