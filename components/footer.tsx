import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="border-t mt-8">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-sm">
          {/* About */}
          <div>
            <h3 className="font-semibold mb-2">Savvy Spender</h3>
            <p className="text-muted-foreground text-xs">
              Free, open-source financial calculators built for Filipino consumers. Compare installment plans, calculate taxes, plan your savings, and more.
            </p>
          </div>

          {/* Calculators */}
          <div>
            <h3 className="font-semibold mb-2">Calculators</h3>
            <ul className="space-y-1 text-xs">
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
            <h3 className="font-semibold mb-2">Resources</h3>
            <ul className="space-y-1 text-xs">
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
            <h3 className="font-semibold mb-2">Disclaimer</h3>
            <p className="text-muted-foreground text-xs">
              This tool is for reference only. Rates and terms vary by bank and may change. Always verify with your bank
              before making financial decisions.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t text-center text-xs text-muted-foreground">
          <p>
            Built with care for Filipino consumers.{" "}
            <Link
              href="https://github.com/Kevin-Umali/savvy-spender"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors underline"
            >
              Open Source on GitHub
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
