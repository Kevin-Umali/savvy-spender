import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="mt-8">
      <div className="container mx-auto px-4">
        <div className="h-px bg-border opacity-50" />
      </div>
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 text-sm">
          {/* About */}
          <div>
            <h3 className="font-display italic font-light text-lg mb-3">Savvy Spender</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Free, open-source financial calculators built for Filipino consumers.
            </p>
          </div>

          {/* Calculators */}
          <div>
            <h3 className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60 mb-3">
              Calculators
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/calculator" className="text-muted-foreground hover:text-foreground transition-colors">
                  Installment Calculator
                </Link>
              </li>
              <li>
                <Link href="/tools/salary" className="text-muted-foreground hover:text-foreground transition-colors">
                  Salary Calculator
                </Link>
              </li>
              <li>
                <Link href="/tools/tax" className="text-muted-foreground hover:text-foreground transition-colors">
                  Tax Calculator
                </Link>
              </li>
              <li>
                <Link href="/tools/investment" className="text-muted-foreground hover:text-foreground transition-colors">
                  Investment Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60 mb-3">
              Resources
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/tools" className="text-muted-foreground hover:text-foreground transition-colors">
                  All Tools
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/bank-conversion-list"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Bank Conversion List
                </Link>
              </li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="font-mono-label text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-60 mb-3">
              Disclaimer
            </h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              For reference only. Rates and terms vary by bank. Always verify with your bank before making financial decisions.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-4 text-center">
          <p className="text-[11px] text-muted-foreground opacity-50">
            Open source on{" "}
            <Link
              href="https://github.com/Kevin-Umali/savvy-spender"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-100 transition-opacity underline"
            >
              GitHub
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
