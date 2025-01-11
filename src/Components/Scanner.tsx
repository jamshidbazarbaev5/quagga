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
        codeReader.current.decodeFromVideoDevice(
            selectedDeviceId,
            'video',
            (result: Result | null, err) => {
                if (result) {
                    const scannedText = result.getText();
                    
                    if (scannedCodes.includes(scannedText)) {
                        setShowErrorModal(true);
                        setIsScanning(false);
                        codeReader.current.reset();
                        return;
                    }

                    console.log(result);
                    setResult(scannedText);
                    setScannedCodes(prev => [...prev, scannedText]);
                    setShowSuccessModal(true);
                    setShowCoins(true);
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

    const handleSuccessAndNavigate = () => {
        setShowSuccessModal(false);
        setShowCoins(false);
        setResult('');
        // navigate('/bonuses');
    };

    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
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
                        Сканировать
                    </button>
                    <button
                        onClick={handleReset}
                        className="w-full py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
                    >
                        Сбросить
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
                            Выберите камеру:
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
                    <pre className={`p-4 rounded-lg border ${
                        result === 'Этот код уже был отсканирован!' 
                            ? 'bg-red-100 text-red-700 border-red-300 font-medium'
                            : 'bg-white'
                    }`}>
                        <code>{result}</code>
                    </pre>
                </div>
            </div>

            {showErrorModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-center mb-2">Ошибка!</h3>
                        <p className="text-center mb-4">Этот код уже был отсканирован!</p>
                        <button
                            onClick={handleCloseErrorModal}
                            className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                            Закрыть
                        </button>
                    </div>
                </div>
            )}

            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full relative overflow-hidden">
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
                                    />
                                ))}
                            </div>
                        )}
                        <h3 className="text-lg font-bold mb-2">Успешно!</h3>
                        <p className="mb-4">Код успешно отсканирован:</p>
                        <pre className="p-4 bg-gray-100 rounded-lg mb-4">
                            <code>{result}</code>
                        </pre>
                        <button
                            onClick={handleSuccessAndNavigate}
                            className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                            Посмотреть мои бонусы
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Scanner;