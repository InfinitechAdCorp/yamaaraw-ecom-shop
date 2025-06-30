"use client";

export default function ETrikeLoader() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        {/* E-Trike SVG Animation */}
        <div className="w-32 h-32 relative">
          <svg
            className="w-full h-full"
            viewBox="0 0 120 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Main Frame */}
            <path
              d="M25 65 L40 45 L55 50 L70 45 L85 65"
              stroke="#F97316"
              strokeWidth="3"
              fill="none"
              className="animate-pulse"
            />

            {/* Rear Cargo Area Frame */}
            <path
              d="M70 45 L95 45 L95 65 L85 65"
              stroke="#F97316"
              strokeWidth="2.5"
              fill="none"
              className="animate-pulse"
            />

            {/* Cargo Box */}
            <rect
              x="72"
              y="35"
              width="20"
              height="12"
              rx="2"
              fill="#F97316"
              fillOpacity="0.3"
              stroke="#F97316"
              strokeWidth="1.5"
              className="animate-pulse"
            />

            {/* Front Wheel */}
            <circle
              cx="25"
              cy="75"
              r="12"
              stroke="#F97316"
              strokeWidth="2.5"
              fill="none"
              className="animate-spin"
              style={{
                transformOrigin: "25px 75px",
                animationDuration: "1s",
              }}
            />

            {/* Front Wheel Spokes */}
            <g
              className="animate-spin"
              style={{
                transformOrigin: "25px 75px",
                animationDuration: "1s",
              }}
            >
              <line
                x1="25"
                y1="63"
                x2="25"
                y2="87"
                stroke="#F97316"
                strokeWidth="1"
              />
              <line
                x1="13"
                y1="75"
                x2="37"
                y2="75"
                stroke="#F97316"
                strokeWidth="1"
              />
              <line
                x1="16.5"
                y1="66.5"
                x2="33.5"
                y2="83.5"
                stroke="#F97316"
                strokeWidth="1"
              />
              <line
                x1="16.5"
                y1="83.5"
                x2="33.5"
                y2="66.5"
                stroke="#F97316"
                strokeWidth="1"
              />
            </g>

            {/* Rear Left Wheel */}
            <circle
              cx="85"
              cy="75"
              r="12"
              stroke="#F97316"
              strokeWidth="2.5"
              fill="none"
              className="animate-spin"
              style={{
                transformOrigin: "85px 75px",
                animationDuration: "1s",
                animationDelay: "0.1s",
              }}
            />

            {/* Rear Left Wheel Spokes */}
            <g
              className="animate-spin"
              style={{
                transformOrigin: "85px 75px",
                animationDuration: "1s",
                animationDelay: "0.1s",
              }}
            >
              <line
                x1="85"
                y1="63"
                x2="85"
                y2="87"
                stroke="#F97316"
                strokeWidth="1"
              />
              <line
                x1="73"
                y1="75"
                x2="97"
                y2="75"
                stroke="#F97316"
                strokeWidth="1"
              />
              <line
                x1="76.5"
                y1="66.5"
                x2="93.5"
                y2="83.5"
                stroke="#F97316"
                strokeWidth="1"
              />
              <line
                x1="76.5"
                y1="83.5"
                x2="93.5"
                y2="66.5"
                stroke="#F97316"
                strokeWidth="1"
              />
            </g>

            {/* Rear Right Wheel */}
            <circle
              cx="95"
              cy="75"
              r="12"
              stroke="#DC2626"
              strokeWidth="2.5"
              fill="none"
              className="animate-spin"
              style={{
                transformOrigin: "95px 75px",
                animationDuration: "1s",
                animationDelay: "0.2s",
              }}
            />

            {/* Rear Right Wheel Spokes */}
            <g
              className="animate-spin"
              style={{
                transformOrigin: "95px 75px",
                animationDuration: "1s",
                animationDelay: "0.2s",
              }}
            >
              <line
                x1="95"
                y1="63"
                x2="95"
                y2="87"
                stroke="#DC2626"
                strokeWidth="1"
              />
              <line
                x1="83"
                y1="75"
                x2="107"
                y2="75"
                stroke="#DC2626"
                strokeWidth="1"
              />
              <line
                x1="86.5"
                y1="66.5"
                x2="103.5"
                y2="83.5"
                stroke="#DC2626"
                strokeWidth="1"
              />
              <line
                x1="86.5"
                y1="83.5"
                x2="103.5"
                y2="66.5"
                stroke="#DC2626"
                strokeWidth="1"
              />
            </g>

            {/* Seat */}
            <rect
              x="48"
              y="38"
              width="18"
              height="5"
              rx="2.5"
              fill="#F97316"
              className="animate-pulse"
            />

            {/* Handlebars */}
            <path
              d="M35 50 L40 45 L45 50"
              stroke="#F97316"
              strokeWidth="2.5"
              fill="none"
              className="animate-pulse"
            />

            {/* Battery Pack */}
            <rect
              x="55"
              y="55"
              width="12"
              height="6"
              rx="2"
              fill="#84CC16"
              className="animate-pulse"
            />

            {/* Battery Indicator Lights */}
            <circle
              cx="58"
              cy="58"
              r="1"
              fill="#22C55E"
              className="animate-ping"
            />
            <circle
              cx="61"
              cy="58"
              r="1"
              fill="#22C55E"
              className="animate-ping"
              style={{ animationDelay: "0.5s" }}
            />
            <circle
              cx="64"
              cy="58"
              r="1"
              fill="#22C55E"
              className="animate-ping"
              style={{ animationDelay: "1s" }}
            />

            {/* Headlight */}
            <circle
              cx="30"
              cy="50"
              r="3"
              fill="#FEF08A"
              className="animate-pulse"
              style={{ animationDuration: "5s" }}
            />

            {/* Motion Lines */}
            <g className="animate-pulse" style={{ animationDuration: "0.8s" }}>
              <line
                x1="5"
                y1="40"
                x2="15"
                y2="40"
                stroke="#F97316"
                strokeWidth="2"
                opacity="0.6"
              />
              <line
                x1="8"
                y1="50"
                x2="18"
                y2="50"
                stroke="#F97316"
                strokeWidth="2"
                opacity="0.4"
              />
              <line
                x1="3"
                y1="60"
                x2="13"
                y2="60"
                stroke="#F97316"
                strokeWidth="2"
                opacity="0.3"
              />
            </g>
          </svg>
        </div>

        {/* Enhanced Loading Animation */}
        <div className="mt-6 text-center">
          {/* Animated Dots */}
          <div className="flex items-center justify-center space-x-2 mb-3">
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

          {/* Loading Text with Gradient */}
          <div className="relative">
            <p className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent animate-pulse">
              YAMAARAW
            </p>
            <p className="text-sm text-gray-600 mt-1 animate-fade-in-out">
              Loading E-Trike System...
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 w-48 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-loading-bar"></div>
          </div>
        </div>
      </div>

      {/* Custom CSS for additional animations */}
      <style jsx>{`
        @keyframes fade-in-out {
          0%,
          100% {
            opacity: 0.5;
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
          animation: fade-in-out 2s ease-in-out infinite;
        }

        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
