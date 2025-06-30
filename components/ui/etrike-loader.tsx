"use client";

export default function ETrikeLoader() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        {/* Enhanced E-Trike SVG Animation */}
        <div className="w-40 h-40 relative">
          <svg
            className="w-full h-full"
            viewBox="0 0 140 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Main Chassis Frame */}
            <path
              d="M30 75 L45 55 L60 60 L75 55 L90 75"
              stroke="#F97316"
              strokeWidth="4"
              fill="none"
              className="animate-pulse"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Rear Cargo Area Frame - More detailed */}
            <path
              d="M75 55 L105 55 L105 75 L90 75"
              stroke="#F97316"
              strokeWidth="3"
              fill="none"
              className="animate-pulse"
              strokeLinecap="round"
            />

            {/* Enhanced Cargo Box with YAMAARAW branding */}
            <rect
              x="77"
              y="42"
              width="26"
              height="15"
              rx="3"
              fill="#F97316"
              fillOpacity="0.2"
              stroke="#F97316"
              strokeWidth="2"
              className="animate-pulse"
            />

            {/* YAMAARAW Logo on cargo box */}
            <text
              x="90"
              y="52"
              fontSize="4"
              fill="#F97316"
              textAnchor="middle"
              className="animate-pulse font-bold"
            >
              YAMAARAW
            </text>

            {/* Driver Seat - More realistic */}
            <rect
              x="52"
              y="45"
              width="20"
              height="8"
              rx="4"
              fill="#DC2626"
              className="animate-pulse"
            />
            <rect
              x="54"
              y="47"
              width="16"
              height="4"
              rx="2"
              fill="#EF4444"
              className="animate-pulse"
            />

            {/* Passenger Seat */}
            <rect
              x="75"
              y="45"
              width="18"
              height="8"
              rx="4"
              fill="#DC2626"
              className="animate-pulse"
            />
            <rect
              x="77"
              y="47"
              width="14"
              height="4"
              rx="2"
              fill="#EF4444"
              className="animate-pulse"
            />

            {/* Enhanced Handlebars with more detail */}
            <path
              d="M40 60 L45 55 L50 60"
              stroke="#374151"
              strokeWidth="3"
              fill="none"
              className="animate-pulse"
              strokeLinecap="round"
            />
            <circle
              cx="40"
              cy="60"
              r="2"
              fill="#6B7280"
              className="animate-pulse"
            />
            <circle
              cx="50"
              cy="60"
              r="2"
              fill="#6B7280"
              className="animate-pulse"
            />

            {/* Steering Column */}
            <line
              x1="45"
              y1="55"
              x2="45"
              y2="65"
              stroke="#374151"
              strokeWidth="2"
              className="animate-pulse"
            />

            {/* Front Wheel - Enhanced with tire tread */}
            <circle
              cx="30"
              cy="85"
              r="15"
              stroke="#1F2937"
              strokeWidth="3"
              fill="#374151"
              className="animate-spin"
              style={{
                transformOrigin: "30px 85px",
                animationDuration: "1.2s",
              }}
            />

            {/* Front Wheel Rim */}
            <circle
              cx="30"
              cy="85"
              r="10"
              stroke="#F97316"
              strokeWidth="2"
              fill="none"
              className="animate-spin"
              style={{
                transformOrigin: "30px 85px",
                animationDuration: "1.2s",
              }}
            />

            {/* Front Wheel Spokes - More detailed */}
            <g
              className="animate-spin"
              style={{
                transformOrigin: "30px 85px",
                animationDuration: "1.2s",
              }}
            >
              <line
                x1="30"
                y1="70"
                x2="30"
                y2="100"
                stroke="#F97316"
                strokeWidth="1.5"
              />
              <line
                x1="15"
                y1="85"
                x2="45"
                y2="85"
                stroke="#F97316"
                strokeWidth="1.5"
              />
              <line
                x1="19.4"
                y1="74.4"
                x2="40.6"
                y2="95.6"
                stroke="#F97316"
                strokeWidth="1.5"
              />
              <line
                x1="19.4"
                y1="95.6"
                x2="40.6"
                y2="74.4"
                stroke="#F97316"
                strokeWidth="1.5"
              />
              <circle cx="30" cy="85" r="3" fill="#F97316" />
            </g>

            {/* Rear Left Wheel - Enhanced */}
            <circle
              cx="90"
              cy="85"
              r="15"
              stroke="#1F2937"
              strokeWidth="3"
              fill="#374151"
              className="animate-spin"
              style={{
                transformOrigin: "90px 85px",
                animationDuration: "1.2s",
                animationDelay: "0.1s",
              }}
            />

            <circle
              cx="90"
              cy="85"
              r="10"
              stroke="#F97316"
              strokeWidth="2"
              fill="none"
              className="animate-spin"
              style={{
                transformOrigin: "90px 85px",
                animationDuration: "1.2s",
                animationDelay: "0.1s",
              }}
            />

            {/* Rear Left Wheel Spokes */}
            <g
              className="animate-spin"
              style={{
                transformOrigin: "90px 85px",
                animationDuration: "1.2s",
                animationDelay: "0.1s",
              }}
            >
              <line
                x1="90"
                y1="70"
                x2="90"
                y2="100"
                stroke="#F97316"
                strokeWidth="1.5"
              />
              <line
                x1="75"
                y1="85"
                x2="105"
                y2="85"
                stroke="#F97316"
                strokeWidth="1.5"
              />
              <line
                x1="79.4"
                y1="74.4"
                x2="100.6"
                y2="95.6"
                stroke="#F97316"
                strokeWidth="1.5"
              />
              <line
                x1="79.4"
                y1="95.6"
                x2="100.6"
                y2="74.4"
                stroke="#F97316"
                strokeWidth="1.5"
              />
              <circle cx="90" cy="85" r="3" fill="#F97316" />
            </g>

            {/* Rear Right Wheel - Enhanced */}
            <circle
              cx="105"
              cy="85"
              r="15"
              stroke="#1F2937"
              strokeWidth="3"
              fill="#374151"
              className="animate-spin"
              style={{
                transformOrigin: "105px 85px",
                animationDuration: "1.2s",
                animationDelay: "0.2s",
              }}
            />

            <circle
              cx="105"
              cy="85"
              r="10"
              stroke="#DC2626"
              strokeWidth="2"
              fill="none"
              className="animate-spin"
              style={{
                transformOrigin: "105px 85px",
                animationDuration: "1.2s",
                animationDelay: "0.2s",
              }}
            />

            {/* Rear Right Wheel Spokes */}
            <g
              className="animate-spin"
              style={{
                transformOrigin: "105px 85px",
                animationDuration: "1.2s",
                animationDelay: "0.2s",
              }}
            >
              <line
                x1="105"
                y1="70"
                x2="105"
                y2="100"
                stroke="#DC2626"
                strokeWidth="1.5"
              />
              <line
                x1="90"
                y1="85"
                x2="120"
                y2="85"
                stroke="#DC2626"
                strokeWidth="1.5"
              />
              <line
                x1="94.4"
                y1="74.4"
                x2="115.6"
                y2="95.6"
                stroke="#DC2626"
                strokeWidth="1.5"
              />
              <line
                x1="94.4"
                y1="95.6"
                x2="115.6"
                y2="74.4"
                stroke="#DC2626"
                strokeWidth="1.5"
              />
              <circle cx="105" cy="85" r="3" fill="#DC2626" />
            </g>

            {/* Enhanced Battery Pack */}
            <rect
              x="60"
              y="65"
              width="18"
              height="8"
              rx="3"
              fill="#84CC16"
              className="animate-pulse"
            />
            <rect
              x="62"
              y="67"
              width="14"
              height="4"
              rx="1"
              fill="#22C55E"
              className="animate-pulse"
            />

            {/* Battery Indicator Lights - More realistic */}
            <circle
              cx="64"
              cy="69"
              r="1.5"
              fill="#22C55E"
              className="animate-ping"
            />
            <circle
              cx="68"
              cy="69"
              r="1.5"
              fill="#22C55E"
              className="animate-ping"
              style={{ animationDelay: "0.3s" }}
            />
            <circle
              cx="72"
              cy="69"
              r="1.5"
              fill="#22C55E"
              className="animate-ping"
              style={{ animationDelay: "0.6s" }}
            />
            <circle
              cx="76"
              cy="69"
              r="1.5"
              fill="#22C55E"
              className="animate-ping"
              style={{ animationDelay: "0.9s" }}
            />

            {/* Enhanced Headlight */}
            <circle
              cx="35"
              cy="60"
              r="4"
              fill="#FEF08A"
              className="animate-pulse"
              style={{ animationDuration: "2s" }}
            />
            <circle
              cx="35"
              cy="60"
              r="2"
              fill="#FBBF24"
              className="animate-pulse"
            />

            {/* Tail Lights */}
            <circle
              cx="108"
              cy="60"
              r="2"
              fill="#EF4444"
              className="animate-pulse"
              style={{ animationDelay: "0.5s" }}
            />
            <circle
              cx="108"
              cy="65"
              r="2"
              fill="#EF4444"
              className="animate-pulse"
              style={{ animationDelay: "0.7s" }}
            />

            {/* Enhanced Motion Lines */}
            <g className="animate-pulse" style={{ animationDuration: "0.8s" }}>
              <line
                x1="5"
                y1="50"
                x2="20"
                y2="50"
                stroke="#F97316"
                strokeWidth="2"
                opacity="0.7"
                strokeLinecap="round"
              />
              <line
                x1="8"
                y1="60"
                x2="23"
                y2="60"
                stroke="#F97316"
                strokeWidth="2"
                opacity="0.5"
                strokeLinecap="round"
              />
              <line
                x1="3"
                y1="70"
                x2="18"
                y2="70"
                stroke="#F97316"
                strokeWidth="2"
                opacity="0.3"
                strokeLinecap="round"
              />
              <line
                x1="6"
                y1="80"
                x2="21"
                y2="80"
                stroke="#F97316"
                strokeWidth="2"
                opacity="0.2"
                strokeLinecap="round"
              />
            </g>

            {/* Electric Spark Effects */}
            <g className="animate-ping" style={{ animationDuration: "1.5s" }}>
              <circle cx="65" cy="62" r="1" fill="#3B82F6" opacity="0.8" />
              <circle cx="70" cy="64" r="0.8" fill="#60A5FA" opacity="0.6" />
              <circle cx="75" cy="63" r="1.2" fill="#93C5FD" opacity="0.4" />
            </g>

            {/* Ground Shadow */}
            <ellipse
              cx="67"
              cy="105"
              rx="45"
              ry="3"
              fill="#000000"
              opacity="0.1"
              className="animate-pulse"
            />
          </svg>
        </div>

        {/* Enhanced Loading Animation */}
        <div className="mt-8 text-center">
          {/* Animated Dots */}
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-bounce"></div>
            <div
              className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>

          {/* Loading Text with Enhanced Gradient */}
          <div className="relative">
            <p className="text-3xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent animate-pulse">
              YAMAARAW
            </p>
            <p className="text-sm text-gray-600 mt-2 animate-fade-in-out font-medium">
              Loading Electric Vehicle System...
            </p>
            <p className="text-xs text-gray-500 mt-1 animate-fade-in-out">
              Sustainable • Reliable • Innovative
            </p>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="mt-6 w-56 h-3 bg-gray-200 rounded-full overflow-hidden mx-auto shadow-inner">
            <div className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 rounded-full animate-loading-bar shadow-sm"></div>
          </div>

          {/* Battery Level Indicator */}
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="text-xs text-gray-500">Battery:</div>
            <div className="flex space-x-1">
              <div className="w-2 h-4 bg-green-500 rounded-sm animate-pulse"></div>
              <div
                className="w-2 h-4 bg-green-400 rounded-sm animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-4 bg-yellow-400 rounded-sm animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
              <div
                className="w-2 h-4 bg-orange-400 rounded-sm animate-pulse"
                style={{ animationDelay: "0.6s" }}
              ></div>
              <div
                className="w-2 h-4 bg-red-400 rounded-sm animate-pulse"
                style={{ animationDelay: "0.8s" }}
              ></div>
            </div>
            <div className="text-xs text-green-600 font-semibold animate-pulse">
              100%
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Custom CSS for additional animations */}
      <style jsx>{`
        @keyframes fade-in-out {
          0%,
          100% {
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes loading-bar {
          0% {
            width: 0%;
            transform: translateX(-100%);
          }
          50% {
            width: 100%;
            transform: translateX(0%);
          }
          100% {
            width: 100%;
            transform: translateX(100%);
          }
        }

        .animate-fade-in-out {
          animation: fade-in-out 3s ease-in-out infinite;
        }

        .animate-loading-bar {
          animation: loading-bar 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
