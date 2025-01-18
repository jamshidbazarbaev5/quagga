"use client";

import { useState, useEffect, useRef } from "react";
import {
  BrowserMultiFormatReader,
  NotFoundException,
  Result,
} from "@zxing/library";
import { Check, X, Award, QrCode } from "lucide-react";
import {useScan, useBonusHistory} from "../api/scan.ts";

declare global {
  interface Window {
    Telegram?: {
      WebApp?: any;
    };
  }
}

export function Scanner() {
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [result, setResult] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [scannedCodes, setScannedCodes] = useState<string[]>([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const codeReader = useRef(new BrowserMultiFormatReader());
  const [message, setMessage] = useState("");
  const [totalBonuses, setTotalBonuses] = useState(0);
  const [scannedCount, setScannedCount] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const isTelegram = useRef(
    window.Telegram?.WebApp !== undefined || 
    /Telegram/i.test(navigator.userAgent)
  );

  const scan = useScan();
  
  const today = new Date().toISOString().split('T')[0];
  const bonusHistory = useBonusHistory({
    from_date: today,
    to_date: today
  });
  const totalBonusHistory = useBonusHistory();

  useEffect(() => {
    if (bonusHistory.data?.pages[0]) {
      const todaysCodes = bonusHistory.data.pages[0].results.map(
        (item) => item.barcode_data
      );
      setScannedCodes(todaysCodes);
      setTodayCount(bonusHistory.data.pages[0].count);
    }
    if (totalBonusHistory.data?.pages[0]) {
      setTotalBonuses(totalBonusHistory.data.pages[0].total_bonuses);
      setScannedCount(totalBonusHistory.data.pages[0].count);
    }
  }, [totalBonusHistory.data, bonusHistory.data]);

  // const handleScan = ()=>{
  //  try{
  //    const response = scan.mutateAsync()
  //  }
  // }

  const handleScan = async (code: string) => {
    try {
      const response = await scan.mutateAsync({ barcode_data: code });
      console.log('Scan response:', response);
      
      if(response.message){
        setMessage(response.message);
      }
      
      // Update scannedCodes with the new code
      setScannedCodes((prev) => [...prev, code]);
      // Refresh bonus history to get updated counts
      bonusHistory.refetch();
      totalBonusHistory.refetch();
      
      setShowSuccessScreen(true);
      setTimeout(() => {
        setShowSuccessScreen(false);
        setResult("");
        handleStart();
      }, 3000);
    } catch (error: any) {
      console.error('Scan error:', error);
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
        handleStart();
      }, 3000);
    }
  };

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          facingMode: 'environment' // Prefer back camera
        }
      });
      setHasPermission(true);
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (err) {
      console.error("Camera permission error:", err);
      setHasPermission(false);
      return false;
    }
  };

  const handleStart = async () => {
    // If we're in Telegram or don't have permission yet, request it
    if (isTelegram.current || !hasPermission) {
      const granted = await requestCameraPermission();
      if (!granted) {
        setShowErrorModal(true);
        return;
      }
    }

    setIsScanning(true);
    let lastScannedTime = 0;
    const cooldownPeriod = 1000;

    try {
      // Initialize devices if needed
      if (!selectedDeviceId) {
        const devices = await codeReader.current.listVideoInputDevices();
        const backCamera = devices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear')
        );
        setSelectedDeviceId(backCamera?.deviceId || devices[0]?.deviceId || "");
      }

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

            if (scannedCodes.includes(scannedText)) {
              setShowErrorModal(true);
              setTimeout(() => setShowErrorModal(false), 3000);
              return;
            }

            setResult(scannedText);
            handleScan(scannedText);
          }
          if (err && !(err instanceof NotFoundException)) {
            console.error(err);
            setResult(err.toString());
            codeReader.current.reset();
            setIsScanning(false);
          }
        }
      );
    } catch (error) {
      console.error("Error starting scanner:", error);
      setHasPermission(false);
      setShowErrorModal(true);
    }
  };

  const handleReset = () => {
    codeReader.current.reset();
    setResult("");
    setIsScanning(false);
  };

  if (hasPermission === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg mb-4">
          <X className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-2" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Нет доступа к камере
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Для сканирования QR-кодов необходим доступ к камере. Пожалуйста, предоставьте разрешение в настройках браузера.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md mx-auto mb-6">
        {/* Combined Stats Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="space-y-6">
            {/* Total Points */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-gray-500 dark:text-gray-400">Всего баллов</h3>
                <div className="flex items-center space-x-2 mt-2">
                  <Award className="w-5 h-5 text-blue-500" />
                  <span className="text-2xl font-bold text-gray-800 dark:text-white">
                    {totalBonuses.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200 dark:bg-gray-700" />

            {/* Total Scanned */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-gray-500 dark:text-gray-400">Отсканировано кодов</h3>
                <div className="flex items-center space-x-2 mt-2">
                  <QrCode className="w-5 h-5 text-purple-500" />
                  <span className="text-2xl font-bold text-gray-800 dark:text-white">
                    {scannedCount.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    (Сегодня: {todayCount})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                {message}
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
