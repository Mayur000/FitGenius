
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface WellnessReport {
  id: string;
  weekOf: string;
  startDate: Date;
  endDate: Date;
  totalScore: number;
  categories: {
    nutrition: number;
    fitness: number;
    sleep: number;
    consistency: number;
  };
  highlights: string[];
  recommendations: string[];
  trends: {
    improving: string[];
    declining: string[];
    stable: string[];
  };
}

export const WeeklyWellnessReports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<WellnessReport | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [selectedPeriod] = useState<'current' | 'last4' | 'last8'>('current');

  const mockReports: WellnessReport[] = [
    {
      id: '1',
      weekOf: 'Mar 10-16, 2024',
      startDate: new Date(2024, 2, 10),
      endDate: new Date(2024, 2, 16),
      totalScore: 85,
      categories: { nutrition: 88, fitness: 82, sleep: 90, consistency: 80 },
      highlights: ['Achieved 85% nutrition goals'],
      recommendations: ['Increase protein intake'],
      trends: {
        improving: ['Sleep'],
        declining: ['Stress'],
        stable: ['Weight']
      }
    }
  ];

  const [reports] = useState<WellnessReport[]>(mockReports);

  const getTrendIcon = (trend: string) =>
    trend === 'improving'
      ? <TrendingUp size={16} className="text-green-500" />
      : <TrendingDown size={16} className="text-red-500" />;

  const generatePDF = async (_report: WellnessReport) => {
    setIsGeneratingPDF(true);
    await new Promise((r) => setTimeout(r, 1000));

    const blob = new Blob(['Sample Report'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'report.txt';
    a.click();

    URL.revokeObjectURL(url);
    setIsGeneratingPDF(false);
  };

  const getPeriodReports = () => {
    if (selectedPeriod === 'current') return reports.slice(0, 1);
    if (selectedPeriod === 'last4') return reports.slice(0, 4);
    return reports.slice(0, 8);
  };

  return (
    <div className="p-6 bg-white rounded-xl">
      {getPeriodReports().map((report) => (
        <motion.div
          key={report.id}
          onClick={() => setSelectedReport(report)}
          className="p-4 bg-gray-50 rounded-lg cursor-pointer"
        >
          <div className="flex justify-between">
            <h3>{report.weekOf}</h3>

            <button
              onClick={(e) => {
                e.stopPropagation();
                generatePDF(report);
              }}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              {isGeneratingPDF ? '...' : 'Export'}
            </button>
          </div>

          <div className="mt-3">
            {report.trends.improving.map((t, i) => (
              <div key={i} className="flex items-center gap-2">
                {getTrendIcon('improving')}
                {t}
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      <AnimatePresence>
        {selectedReport && (
          <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded">
              <h2>{selectedReport.weekOf}</h2>
              <button onClick={() => setSelectedReport(null)}>Close</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

