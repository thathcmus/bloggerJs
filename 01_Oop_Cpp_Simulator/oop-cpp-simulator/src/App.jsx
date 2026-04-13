import React, { useState, useEffect } from 'react';
import { Shield, Unlock, Lock, Layers, Cpu, Network, EyeOff, Eye, Key, Terminal, Code, Database, Zap } from 'lucide-react';

// --- MAIN APP COMPONENT ---
export default function App() {
  const [activeTab, setActiveTab] = useState('encapsulation');

  const tabs = [
    { id: 'encapsulation', name: 'Đóng gói (Encapsulation)', icon: <Shield size={18} /> },
    { id: 'inheritance', name: 'Kế thừa (Inheritance)', icon: <Layers size={18} /> },
    { id: 'polymorphism', name: 'Đa hình (Polymorphism)', icon: <Network size={18} /> },
    { id: 'abstraction', name: 'Trừu tượng (Abstraction)', icon: <EyeOff size={18} /> },
  ];
  // Thêm đoạn này vào bên trong function App(), ngay trước dòng return
  useEffect(() => {
    const sendHeight = () => {
      // Đo chiều cao toàn bộ body của app
      const height = document.body.scrollHeight;
      // Gửi tín hiệu ra ngoài (cho iframe cha)
      window.parent.postMessage({ frameHeight: height }, '*');
    };

    // Gửi chiều cao ngay khi load xong
    sendHeight();

    // Tạo một bộ theo dõi (Observer) để gửi lại chiều cao nếu nội dung thay đổi
    // (ví dụ khi bạn bấm chuyển qua lại giữa các tab)
    const observer = new ResizeObserver(sendHeight);
    observer.observe(document.body);

    return () => observer.disconnect();
  }, []);
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-2">
            C++ OOP Simulator cho Embedded Engineer
          </h1>
          <p className="text-slate-400">Hiểu rõ bản chất 4 tính chất OOP qua góc nhìn Hệ thống Nhúng</p>
        </header>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl min-h-[500px]">
          {activeTab === 'encapsulation' && <EncapsulationSim />}
          {activeTab === 'inheritance' && <InheritanceSim />}
          {activeTab === 'polymorphism' && <PolymorphismSim />}
          {activeTab === 'abstraction' && <AbstractionSim />}
        </div>
      </div>
    </div>
  );
}

// --- 1. ENCAPSULATION SIMULATOR ---
function EncapsulationSim() {
  const [logs, setLogs] = useState([]);
  const [adcValue, setAdcValue] = useState(1024);

  const addLog = (msg, type) => {
    setLogs(prev => [...prev.slice(-4), { msg, type }]);
  };

  const handlePrivateAccess = () => {
    addLog("Lỗi Biên Dịch: 'raw_ADC_register' is private within this context!", "error");
  };

  const handlePublicAccess = () => {
    const temp = (adcValue * 3.3) / 4095; // Fake conversion
    addLog(`Thành công: readTemperature() trả về ${temp.toFixed(2)} °C`, "success");
  };

  const handleModifyPublic = () => {
    setAdcValue(Math.floor(Math.random() * 4095));
    addLog("Thành công: Cảm biến đã cập nhật giá trị ADC nội bộ.", "info");
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-blue-400 flex items-center gap-2"><Shield /> Đóng gói (Encapsulation)</h2>
        <p className="text-slate-300 mt-2">Bảo vệ dữ liệu nội bộ (thanh ghi) khỏi việc bị sửa đổi tuỳ tiện từ bên ngoài. Chỉ cho phép tương tác qua các hàm API (public methods) an toàn đã được kiểm soát.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User Code Side */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
          <h3 className="font-mono text-emerald-400 mb-4 flex items-center gap-2"><Code size={18}/> int main()</h3>
          <div className="space-y-3">
            <button onClick={handlePrivateAccess} className="w-full text-left font-mono bg-slate-800 hover:bg-red-900/40 border border-red-500/30 p-3 rounded text-slate-300 transition-colors">
              <span className="text-red-400">sensor.raw_ADC_register = 9999;</span> <br/>
              <span className="text-xs text-slate-500">// Cố tình ghi đè thanh ghi</span>
            </button>
            <button onClick={handlePublicAccess} className="w-full text-left font-mono bg-slate-800 hover:bg-emerald-900/40 border border-emerald-500/30 p-3 rounded text-slate-300 transition-colors">
              <span className="text-emerald-400">float temp = sensor.readTemperature();</span> <br/>
              <span className="text-xs text-slate-500">// Gọi API an toàn</span>
            </button>
            <button onClick={handleModifyPublic} className="w-full text-left font-mono bg-slate-800 hover:bg-blue-900/40 border border-blue-500/30 p-3 rounded text-slate-300 transition-colors">
              <span className="text-blue-400">Hệ thống: Cập nhật môi trường</span>
            </button>
          </div>

          <div className="mt-6 bg-black p-3 rounded text-sm font-mono h-40 overflow-y-auto border border-slate-700">
            <div className="text-slate-500 mb-2">--- Console Output ---</div>
            {logs.map((l, i) => (
              <div key={i} className={`${l.type === 'error' ? 'text-red-500' : l.type === 'success' ? 'text-emerald-400' : 'text-blue-400'} mb-1`}>
                {l.type === 'error' ? '[ERROR] ' : '[OK] '} {l.msg}
              </div>
            ))}
          </div>
        </div>

        {/* Object Internals Side */}
        <div className="relative border-2 border-dashed border-slate-600 rounded-xl p-6 bg-slate-800/50">
          <div className="absolute -top-3 left-4 bg-slate-800 px-2 font-mono text-blue-400 font-bold">class TempSensor</div>
          
          <div className="space-y-6 mt-4">
            {/* Private Section */}
            <div className="bg-red-950/30 border border-red-500/30 rounded-lg p-4 relative">
              <div className="absolute -top-3 right-4 bg-slate-800 px-2 text-red-400 text-xs flex items-center gap-1"><Lock size={12}/> private</div>
              <div className="font-mono text-slate-300">
                <span className="text-purple-400">uint16_t</span> raw_ADC_register = <span className="text-yellow-400">{adcValue}</span>;
              </div>
              <p className="text-xs text-slate-500 mt-2">Khu vực cấm truy cập trực tiếp từ main()</p>
            </div>

            {/* Public Section */}
            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-lg p-4 relative">
              <div className="absolute -top-3 right-4 bg-slate-800 px-2 text-emerald-400 text-xs flex items-center gap-1"><Unlock size={12}/> public</div>
              <div className="font-mono text-slate-300">
                <span className="text-purple-400">float</span> <span className="text-blue-400">readTemperature</span>() {'{'}
                <div className="pl-4 text-slate-400">
                  <span className="text-slate-500">// Đọc an toàn từ raw_ADC_register</span><br/>
                  <span className="text-pink-400">return</span> (raw_ADC_register * 3.3) / 4095;<br/>
                </div>
                {'}'}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded text-sm text-blue-200">
        <strong>💡 Bản chất:</strong> Giống như việc bạn giấu phần cứng nhạy cảm vào một hộp đen (private), chỉ thò ra các nút bấm (public). Người dùng bấm nút, hộp đen tự xử lý. Hạn chế tối đa lỗi do người dùng chọc ngoáy sai thanh ghi.
      </div>
    </div>
  );
}

// --- 2. INHERITANCE SIMULATOR ---
function InheritanceSim() {
  const [selectedClass, setSelectedClass] = useState('base');

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-emerald-400 flex items-center gap-2"><Layers /> Kế thừa (Inheritance)</h2>
        <p className="text-slate-300 mt-2">Tái sử dụng mã nguồn. Lớp con (Derived) kế thừa lại tất cả đặc tính của Lớp cha (Base), sau đó có thể mở rộng thêm tính năng riêng của nó mà không phải viết lại code cũ.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Class Hierarchy Tree */}
        <div className="flex-1 w-full bg-slate-900 p-6 rounded-xl border border-slate-700 flex flex-col items-center">
          {/* Base Class */}
          <button 
            onClick={() => setSelectedClass('base')}
            className={`w-64 p-3 rounded-lg border-2 text-center transition-all ${selectedClass === 'base' ? 'border-emerald-500 bg-emerald-900/30' : 'border-slate-600 bg-slate-800 hover:border-slate-500'}`}
          >
            <div className="font-mono font-bold text-emerald-400">class Peripheral</div>
            <div className="text-xs text-slate-400 mt-1">Base Class</div>
          </button>

          {/* Arrows */}
          <div className="flex w-64 justify-between px-12">
            <div className="w-0.5 h-8 bg-slate-600"></div>
            <div className="w-0.5 h-8 bg-slate-600"></div>
          </div>
          <div className="w-40 h-0.5 bg-slate-600 -mt-8 mb-8"></div>

          {/* Derived Classes */}
          <div className="flex gap-4 w-full justify-center">
            <button 
              onClick={() => setSelectedClass('uart')}
              className={`w-40 p-3 rounded-lg border-2 text-center transition-all ${selectedClass === 'uart' ? 'border-blue-500 bg-blue-900/30' : 'border-slate-600 bg-slate-800 hover:border-slate-500'}`}
            >
              <div className="font-mono font-bold text-blue-400">class UART</div>
              <div className="text-xs text-slate-400 mt-1">Derived Class</div>
            </button>

            <button 
              onClick={() => setSelectedClass('spi')}
              className={`w-40 p-3 rounded-lg border-2 text-center transition-all ${selectedClass === 'spi' ? 'border-purple-500 bg-purple-900/30' : 'border-slate-600 bg-slate-800 hover:border-slate-500'}`}
            >
              <div className="font-mono font-bold text-purple-400">class SPI</div>
              <div className="text-xs text-slate-400 mt-1">Derived Class</div>
            </button>
          </div>
        </div>

        {/* Memory/Member Layout */}
        <div className="flex-1 w-full bg-slate-900 p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2"><Database size={18}/> Các thành phần (Members)</h3>
          
          <div className="space-y-3 font-mono text-sm">
            {/* Always show Base members if base or any child is selected */}
            <div className="p-3 border border-emerald-500/50 bg-emerald-900/20 rounded">
              <div className="text-xs text-emerald-400 mb-1 flex items-center gap-1"><Layers size={12}/> Inherited from Peripheral</div>
              <div className="text-slate-300">bool isEnabled;</div>
              <div className="text-slate-300">uint32_t baseAddress;</div>
              <div className="text-slate-300">void powerOn();</div>
            </div>

            {/* Show UART specific */}
            {selectedClass === 'uart' && (
              <div className="p-3 border border-blue-500/50 bg-blue-900/20 rounded animate-fade-in">
                <div className="text-xs text-blue-400 mb-1 flex items-center gap-1"><Zap size={12}/> UART Specific</div>
                <div className="text-slate-300">uint32_t baudRate;</div>
                <div className="text-slate-300">void setBaud(uint32_t b);</div>
              </div>
            )}

            {/* Show SPI specific */}
            {selectedClass === 'spi' && (
              <div className="p-3 border border-purple-500/50 bg-purple-900/20 rounded animate-fade-in">
                <div className="text-xs text-purple-400 mb-1 flex items-center gap-1"><Zap size={12}/> SPI Specific</div>
                <div className="text-slate-300">bool isMaster;</div>
                <div className="text-slate-300">void setClockPolarity();</div>
              </div>
            )}
          </div>
          
          <div className="mt-6 text-sm text-slate-400">
            {selectedClass === 'base' && "Lớp Peripheral chỉ chứa các đặc điểm chung của mọi ngoại vi."}
            {selectedClass === 'uart' && "Lớp UART CÓ SẴN isEnabled, baseAddress từ Peripheral, CỘNG THÊM baudRate của riêng nó."}
            {selectedClass === 'spi' && "Lớp SPI CÓ SẴN isEnabled, baseAddress từ Peripheral, CỘNG THÊM cấu hình Master/Slave của riêng nó."}
          </div>
        </div>
      </div>
      
      <div className="bg-emerald-900/20 border-l-4 border-emerald-500 p-4 rounded text-sm text-emerald-200">
        <strong>💡 Bản chất:</strong> Cơ chế "DRY - Don't Repeat Yourself". Thay vì copy-paste code bật/tắt nguồn (powerOn) cho I2C, SPI, UART, ta gom nó vào lớp cha <code>Peripheral</code>. Các giao thức con chỉ cần quan tâm viết code đặc thù của giao thức đó.
      </div>
    </div>
  );
}

// --- 3. POLYMORPHISM SIMULATOR ---
function PolymorphismSim() {
  const [activeDevice, setActiveDevice] = useState(null);
  const [output, setOutput] = useState([]);

  const devices = [
    { id: 'i2c', name: 'I2C_Module', color: 'text-yellow-400', action: 'Gửi START condition -> Địa chỉ Slave -> Data -> STOP condition.' },
    { id: 'spi', name: 'SPI_Module', color: 'text-purple-400', action: 'Kéo CS xuống LOW -> Cấp xung Clock -> Shift bit ra MOSI.' },
    { id: 'flexray', name: 'FlexRay_Module', color: 'text-rose-400', action: 'Đồng bộ thời gian (TDMA) -> Đóng gói payload vào slot tĩnh -> Truyền.' },
  ];

  const transmitData = () => {
    if (activeDevice !== null) {
      const dev = devices[activeDevice];
      setOutput(prev => [...prev.slice(-3), { 
        code: `ptr->transmit(data);`, 
        result: `[${dev.name}]: ${dev.action}`,
        color: dev.color
      }]);
    } else {
      setOutput(prev => [...prev.slice(-3), { 
        code: `ptr->transmit(data);`, 
        result: `Lỗi: Con trỏ chưa trỏ vào object nào! (Segmentation fault)`,
        color: 'text-red-500'
      }]);
    }
  };

  return (
    <div className="space-y-6">
       <div className="mb-4">
        <h2 className="text-2xl font-bold text-yellow-400 flex items-center gap-2"><Network /> Đa hình (Polymorphism)</h2>
        <p className="text-slate-300 mt-2">"Một giao diện, nhiều hành vi". Cùng một con trỏ lớp cha, cùng gọi một hàm ảo (virtual function), nhưng hành vi chạy thực tế phụ thuộc vào object con mà nó đang trỏ tới.</p>
      </div>

      <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
        {/* Code representation */}
        <div className="font-mono text-sm bg-slate-950 p-4 rounded border border-slate-800 mb-6">
          <span className="text-purple-400">Peripheral*</span> ptr = <span className="text-slate-500">/* Chọn object ở dưới */</span>;<br/>
          <span className="text-slate-500">// Gọi hàm virtual chung:</span><br/>
          <span className="text-blue-400">ptr-&gt;transmit</span>(data);
        </div>

        {/* Object selection */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-8">
          <div className="flex-1 w-full space-y-3">
            <div className="text-sm font-bold text-slate-400 mb-2">1. Gán con trỏ ptr vào object:</div>
            {devices.map((dev, index) => (
              <button 
                key={dev.id}
                onClick={() => setActiveDevice(index)}
                className={`w-full text-left px-4 py-3 rounded border font-mono transition-all ${
                  activeDevice === index 
                  ? 'bg-slate-800 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]' 
                  : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-400'
                }`}
              >
                ptr = <span className="text-pink-400">new</span> <span className={dev.color}>{dev.name}</span>();
              </button>
            ))}
          </div>

          <div className="flex-shrink-0 flex items-center justify-center p-4">
            <button 
              onClick={transmitData}
              className="bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-4 rounded-full font-bold shadow-lg flex items-center gap-2 transform active:scale-95 transition-all"
            >
              <Zap size={20}/> Thực thi ptr-&gt;transmit()
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="bg-black p-4 rounded text-sm font-mono h-32 overflow-y-auto border border-slate-700">
          <div className="text-slate-500 mb-2">--- Hành vi thực tế lúc Runtime ---</div>
          {output.map((log, i) => (
            <div key={i} className="mb-2 border-b border-slate-800 pb-1">
              <span className="text-slate-400">{log.code}</span> <br/>
              <span className={log.color}>=&gt; {log.result}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded text-sm text-yellow-200">
        <strong>💡 Bản chất:</strong> Nhờ cơ chế Virtual Table (vtable). Người viết module quản lý cấp cao (như Task Manager) chỉ cần lưu 1 mảng <code>Peripheral*</code> và gọi <code>transmit()</code> mà không cần viết lệnh <code>switch-case</code> hay <code>if-else</code> xem nó là I2C hay FlexRay. Thêm 1 giao thức mới (như CAN) cũng không cần sửa code Task Manager.
      </div>
    </div>
  );
}

// --- 4. ABSTRACTION SIMULATOR ---
function AbstractionSim() {
  const [showInternals, setShowInternals] = useState(false);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [cipherText, setCipherText] = useState("****************");

  const handleEncrypt = () => {
    setIsEncrypting(true);
    setCipherText("Đang xử lý...");
    
    // Simulate delay for effect
    setTimeout(() => {
      const hex = Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join('').toUpperCase();
      setCipherText(`0x${hex}`);
      setIsEncrypting(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
       <div className="mb-4">
        <h2 className="text-2xl font-bold text-rose-400 flex items-center gap-2"><EyeOff /> Trừu tượng (Abstraction)</h2>
        <p className="text-slate-300 mt-2">Ẩn đi sự phức tạp của quá trình cài đặt (implementation), chỉ bộc lộ ra giao diện sử dụng (interface) thiết yếu nhất. Giúp lập trình viên sử dụng module mà không cần "nhức đầu" vì chi tiết bên trong.</p>
      </div>

      <div className="flex justify-end mb-2">
        <button 
          onClick={() => setShowInternals(!showInternals)}
          className="flex items-center gap-2 text-sm text-rose-400 hover:text-rose-300 bg-rose-900/20 px-3 py-1 rounded-full border border-rose-500/30 transition-colors"
        >
          {showInternals ? <EyeOff size={16}/> : <Eye size={16}/>}
          {showInternals ? "Ẩn chi tiết nội bộ" : "Bật mode X-Ray (Xem chi tiết)"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-900 p-6 rounded-xl border border-slate-700">
        
        {/* Simple Interface */}
        <div className="flex flex-col items-center justify-center p-6 border-2 border-slate-600 rounded-xl bg-slate-800">
          <h3 className="text-slate-200 font-bold mb-6 flex items-center gap-2"><Terminal size={20}/> Giao diện (Interface)</h3>
          
          <div className="w-full bg-slate-950 p-4 rounded text-center mb-6 font-mono text-sm border border-slate-700 text-blue-400">
            CryptoEngine.encrypt(data);
          </div>

          <button 
            onClick={handleEncrypt}
            disabled={isEncrypting}
            className={`w-full py-3 rounded font-bold transition-all flex justify-center items-center gap-2 ${
              isEncrypting ? 'bg-slate-600 text-slate-400 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-500 text-white'
            }`}
          >
            {isEncrypting ? <Cpu className="animate-spin" size={18}/> : <Key size={18}/>}
            {isEncrypting ? 'Processing...' : 'Gọi hàm Encrypt()'}
          </button>

          <div className="mt-6 w-full text-center font-mono text-sm text-slate-400 bg-slate-900 p-2 rounded">
            Output: <span className="text-emerald-400 font-bold">{cipherText}</span>
          </div>
        </div>

        {/* Complex Internals */}
        <div className={`relative p-6 rounded-xl border-2 transition-all duration-500 overflow-hidden min-h-[300px] flex flex-col justify-center ${
          showInternals ? 'border-rose-500/50 bg-slate-950 opacity-100 scale-100' : 'border-slate-700 bg-slate-900/50 opacity-30 blur-sm scale-95 pointer-events-none'
        }`}>
          {!showInternals && (
             <div className="absolute inset-0 flex items-center justify-center z-10 text-slate-500 font-bold text-lg rotate-[-15deg]">
               [CHI TIẾT BỊ ẨN]
             </div>
          )}
          
          <h3 className="text-rose-400 font-bold mb-4 flex items-center gap-2 text-sm z-0"><Cpu size={16}/> Cơ chế AES-256 nội bộ</h3>
          
          <div className="space-y-2 font-mono text-xs z-0">
            <div className={`p-2 rounded bg-slate-800 border-l-2 border-slate-600 ${isEncrypting ? 'text-white animate-pulse border-rose-500' : 'text-slate-500'}`}>1. KeyExpansion(key, w)</div>
            <div className={`p-2 rounded bg-slate-800 border-l-2 border-slate-600 ${isEncrypting ? 'text-white animate-pulse delay-75 border-rose-500' : 'text-slate-500'}`}>2. AddRoundKey(state, w[0])</div>
            
            <div className="pl-4 py-1 text-slate-600 italic">For i = 1 to 13:</div>
            <div className="pl-6 space-y-1">
              <div className={`p-1.5 rounded bg-slate-800 border-l-2 border-slate-600 ${isEncrypting ? 'text-blue-300 border-blue-500' : 'text-slate-500'}`}>- SubBytes(state)</div>
              <div className={`p-1.5 rounded bg-slate-800 border-l-2 border-slate-600 ${isEncrypting ? 'text-purple-300 border-purple-500' : 'text-slate-500'}`}>- ShiftRows(state)</div>
              <div className={`p-1.5 rounded bg-slate-800 border-l-2 border-slate-600 ${isEncrypting ? 'text-yellow-300 border-yellow-500' : 'text-slate-500'}`}>- MixColumns(state)</div>
              <div className={`p-1.5 rounded bg-slate-800 border-l-2 border-slate-600 ${isEncrypting ? 'text-rose-300 border-rose-500' : 'text-slate-500'}`}>- AddRoundKey(...)</div>
            </div>
            
            <div className="pl-4 py-1 text-slate-600 italic">Final Round:</div>
            <div className={`p-2 rounded bg-slate-800 border-l-2 border-slate-600 ${isEncrypting ? 'text-white animate-pulse border-rose-500' : 'text-slate-500'}`}>SubBytes -&gt; ShiftRows -&gt; AddRoundKey</div>
          </div>
        </div>
      </div>

      <div className="bg-rose-900/20 border-l-4 border-rose-500 p-4 rounded text-sm text-rose-200">
        <strong>💡 Bản chất:</strong> Abstract class (thường dùng các hàm <code>virtual pure = 0</code>) định nghĩa CÁI GÌ cần làm (Encrypt), chứ không quan tâm LÀM THẾ NÀO. Là kỹ sư sử dụng thư viện mã hóa, bạn chỉ cần gọi <code>encrypt()</code> là xong, không cần (và không nên) đi sâu vào code MixColumns hay SubBytes trừ khi bạn là người viết ra module đó. Đây là cách ta chống "cháy não" khi dự án phình to.
      </div>
    </div>
  );
}