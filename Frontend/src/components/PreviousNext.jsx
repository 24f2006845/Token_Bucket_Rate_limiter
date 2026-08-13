import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function PreviousNext({ prev, next }) {
  return (
    <div className="flex items-center justify-between mt-16 pt-8 border-t border-border">
      {prev ? (
        <Link to={prev.href} className="group flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors">
          <ChevronLeft className="w-4 h-4" />
          <div>
            <div className="text-xs text-text-muted">Previous</div>
            <div className="text-text-secondary group-hover:text-text">{prev.label}</div>
          </div>
        </Link>
      ) : <div />}
      {next ? (
        <Link to={next.href} className="group flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors text-right">
          <div>
            <div className="text-xs text-text-muted">Next</div>
            <div className="text-text-secondary group-hover:text-text">{next.label}</div>
          </div>
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : <div />}
    </div>
  );
}
