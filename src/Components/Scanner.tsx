import { useState, useEffect, useRef } from 'react';
import { BrowserMultiFormatReader, NotFoundException, Result } from '@zxing/library';
// import { useNavigate } from 'react-router-dom';
import '../scaner.css'

export const Scanner = () => {
    // const navigate = useNavigate();
    const [selectedDeviceId, setSelectedDeviceId] = useState('');
    const [videoInputDevices, setVideoInputDevices] = useState<MediaDeviceInfo[]>([]);
    const [result, setResult] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const codeReader = useRef(new BrowserMultiFormatReader());
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showCoins, setShowCoins] = useState(false);
    const [scannedCodes, setScannedCodes] = useState<string[]>([]);
    const [showErrorModal, setShowErrorModal] = useState(false);


    useEffect(() => {
        const initializeDevices = async () => {
            try {
                const devices = await codeReader.current.listVideoInputDevices();
                setVideoInputDevices(devices);
                if (devices.length > 0) {
                    setSelectedDeviceId(devices[0].deviceId);
                }
            } catch (err) {
                console.error('Ошибка при получении списка видеоустройств:', err);
            }
        };

        initializeDevices();

        return () => {
            codeReader.current.reset();
        };
    }, []);

    const handleStart = () => {
        setIsScanning(true);
        let lastScannedTime = 0; // Add cooldown tracking
        const cooldownPeriod = 1000; // 1 second cooldown

        codeReader.current.decodeFromVideoDevice(
            selectedDeviceId,
            'video',
            (result: Result | null, err) => {
                if (result) {
                    const currentTime = Date.now();
                    if (currentTime - lastScannedTime < cooldownPeriod) {
                        return; 
                    }
                    lastScannedTime = currentTime;

                    const scannedText = result.getText();
                    
                    if (!scannedText || 
                        scannedText.trim() === '' || 
                        scannedText.length < 4 ||
                        !isValidQRCode(scannedText)) { 
                        return;
                    }

                    codeReader.current.reset();
                    setIsScanning(false);

                    if (scannedCodes.includes(scannedText)) {
                        setShowErrorModal(true);
                        setTimeout(() => {
                            setShowErrorModal(false);
                        }, 3000);
                        return;
                    }

                    console.log(result);
                    setResult(scannedText);
                    setScannedCodes(prev => [...prev, scannedText]);
                    setShowSuccessModal(true);
                    setShowCoins(true);
                    
                    setTimeout(() => {
                        handleSuccessAndNavigate();
                    }, 3000);
                }
                if (err && !(err instanceof NotFoundException)) {
                    console.error(err);
                    setResult(err.toString());
                    codeReader.current.reset();
                    setIsScanning(false);
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

    const handleSuccessAndNavigate = () => {
        setShowSuccessModal(false);
        setShowCoins(false);
        setResult('');
    };

    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
    };

    const isValidQRCode = (text: string) => {
        // Add your QR code format validation here
        // For example, checking if it starts with a specific prefix
        // or matches a certain pattern
        return /^[A-Za-z0-9-_]+$/.test(text); // Basic alphanumeric validation
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
            <div className="max-w-md mx-auto">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <button
                        onClick={handleStart}
                        disabled={isScanning}
                        className="w-full py-3 bg-blue-500 dark:bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-600 dark:hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600"
                    >
                        Сканировать
                    </button>
                    <button
                        onClick={handleReset}
                        className="w-full py-3 bg-red-500 dark:bg-red-600 text-white rounded-lg font-medium hover:bg-red-600 dark:hover:bg-red-700"
                    >
                        Сбросить
                    </button>
                </div>

                <div className="mb-4 relative aspect-video">
                    <video
                        id="video"
                        className="w-full h-full object-cover rounded-lg border-2 border-gray-300 dark:border-gray-700 [transition:none]"
                    />
                </div>

                {videoInputDevices.length > 1 && (
                    <div className="mb-4">
                        <label htmlFor="sourceSelect" className="block mb-2 font-medium text-gray-900 dark:text-gray-100">
                            Выберите камеру:
                        </label>
                        <select
                            id="sourceSelect"
                            value={selectedDeviceId}
                            onChange={handleDeviceChange}
                            className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
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
                    <pre className={`p-4 rounded-lg border ${
                        result === 'Этот код уже был отсканирован!' 
                            ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 border-red-300 dark:border-red-700 font-medium'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700'
                    }`}>
                        <code>{result}</code>
                    </pre>
                </div>
            </div>

            {showErrorModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-center mb-2 text-gray-900 dark:text-gray-100">Ошибка!</h3>
                        <p className="text-center mb-4 text-gray-700 dark:text-gray-300">Этот код уже был отсканирован!</p>
                        <button
                            onClick={handleCloseErrorModal}
                            className="w-full py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700"
                        >
                            Закрыть
                        </button>
                    </div>
                </div>
            )}

            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full relative overflow-hidden">
                        {showCoins && (
                            <div className="coin-container absolute inset-0 pointer-events-none">
                                {[...Array(10)].map((_, i) => (
                                    <div 
                                        key={i} 
                                        className="coin"
                                        style={{
                                            left: `${Math.random() * 100}%`,
                                            animationDelay: `${i * 0.1}s`
                                        }}
                                    ></div>
                                ))}
                            </div>
                        )}
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-center mb-2 text-gray-900 dark:text-gray-100">Успешно!</h3>
                        <p className="text-center mb-4 text-gray-700 dark:text-gray-300">QR-код успешно отсканирован!</p>
                        <button
                            onClick={handleSuccessAndNavigate}
                            className="w-full py-2 bg-green-500 dark:bg-green-600 text-white rounded-lg hover:bg-green-600 dark:hover:bg-green-700"
                        >
                            Продолжить
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};