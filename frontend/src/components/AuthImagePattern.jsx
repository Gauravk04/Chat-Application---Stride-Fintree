const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center  p-12">
      <div className="max-w-md text-center">
        {/* Decorative animated grid */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl transition-all duration-700 ease-in-out 
                ${
                  i % 2 === 0
                    ? "bg-primary/10 animate-pulse"
                    : "bg-accent/5 hover:scale-105"
                } shadow-sm`}
            />
          ))}
        </div>

        {/* Title and subtitle */}
        <h2 className="text-3xl font-extrabold text-base-content mb-3 leading-snug tracking-tight">
          {title}
        </h2>
        <p className="text-base text-base-content/80 leading-relaxed">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;