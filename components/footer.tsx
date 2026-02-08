import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="border-t mt-8">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          {/* About */}
          <div>
            <h3 className="font-semibold mb-2">Savvy Spender</h3>
            <p className="text-muted-foreground text-xs">
              A free financial calculator for Philippine bank installment products. Compare balance conversions,
              credit-to-cash, and personal loan options.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-1 text-xs">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Calculator
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
