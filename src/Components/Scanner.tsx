"use client";

import { useState, useEffect, useRef } from "react";
import {
  BrowserMultiFormatReader,
  NotFoundException,
  Result,
} from "@zxing/library";
import { Check, X } from "lucide-react";

export function Scanner() {
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [videoInputDevices, setVideoInputDevices] = useState<MediaDeviceInfo[]>(
    []
  );
  const [result, setResult] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [scannedCodes, setScannedCodes] = useState<string[]>([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const codeReader = useRef(new BrowserMultiFormatReader());
  const [earnedPoints, setEarnedPoints] = useState(10);

  useEffect(() => {
    const initializeDevices = async () => {
      try {
        const devices = await codeReader.current.listVideoInputDevices();
        setVideoInputDevices(devices);
        if (devices.length > 0) {
          setSelectedDeviceId(devices[0].deviceId);
        }
      } catch (err) {
        console.error("Ошибка при получении списка видеоустройств:", err);
      }
    };

    initializeDevices();

    return () => {
      codeReader.current.reset();
    };
  }, []);

  const handleStart = () => {
    setIsScanning(true);
    let lastScannedTime = 0;
    const cooldownPeriod = 1000;

    codeReader.current.decodeFromVideoDevice(
      selectedDeviceId,
      "video",
      (result: Result | null, err) => {
        if (result) {
          const currentTime = Date.now();
          if (currentTime - lastScannedTime < cooldownPeriod) {
            return;
          }
          lastScannedTime = currentTime;

          const scannedText = result.getText();

          if (
            !scannedText ||
            scannedText.trim() === "" ||
            scannedText.length < 4 ||
            !/^[A-Za-z0-9-_]+$/.test(scannedText)
          ) {
            return;
          }

          codeReader.current.reset();
          setIsScanning(false);

          if (scannedCodes.includes(scannedText)) {
            setShowErrorModal(true);
            setTimeout(() => setShowErrorModal(false), 3000);
            return;
          }

          setResult(scannedText);
          setScannedCodes((prev) => [...prev, scannedText]);
          setEarnedPoints(10);
          setShowSuccessScreen(true);

          setTimeout(() => {
            setShowSuccessScreen(false);
            setResult("");
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
    setResult("");
    setIsScanning(false);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      {showSuccessScreen ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-green-500 rounded-2xl p-9 m-4 shadow-lg animate-scale-in">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-32 h-32 bg-green-400/20 rounded-full animate-pulse" />
              <div className="absolute w-24 h-24 bg-green-400/30 rounded-full animate-pulse delay-75" />
              <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center animate-fadeIn">
                <Check className="w-8 h-8 text-green-500 animate-checkmark" />
              </div>
            </div>
            <div className="mt-8 text-center space-y-2 animate-fadeIn delay-200">
              <h1 className="text-white text-2xl font-medium">
                Выполнено!
              </h1>
              <p className="text-green-100 text-lg">
                Вы получили {earnedPoints} баллов
              </p>
            </div>
          </div>
        </div>
      ) : (
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
              <label
                htmlFor="sourceSelect"
                className="block mb-2 font-medium text-gray-900 dark:text-gray-100"
              >
                Выберите камеру:
              </label>
              <select
                id="sourceSelect"
                value={selectedDeviceId}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
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

          {result && (
            <div className="mb-4">
              <pre className="p-4 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700">
                <code>{result}</code>
              </pre>
            </div>
          )}
        </div>
      )}

      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                <X className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-center mb-2 text-gray-900 dark:text-gray-100">
              Ошибка!
            </h3>
            <p className="text-center mb-4 text-gray-700 dark:text-gray-300">
              Этот код уже был отсканирован!
            </p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="w-full py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
