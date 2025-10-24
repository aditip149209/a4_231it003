// app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { collectedData } from './data/collectedData';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

// Types
interface DistributionResult {
  probability: number;
  mean: number;
  variance: number;
}

interface ContinuousResult {
  pdf: number;
  cdf?: number;
  mean: number;
  variance: number;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
    tension?: number;
  }[];
}

// Factorial function
const factorial = (n: number): number => {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
};

// Combination function
const combination = (n: number, r: number): number => {
  return factorial(n) / (factorial(r) * factorial(n - r));
};

// Discrete Distribution Functions
const binomialPMF = (n: number, p: number, k: number): number => {
  return combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
};

const geometricPMF = (p: number, k: number): number => {
  return Math.pow(1 - p, k - 1) * p;
};

const negativeBinomialPMF = (r: number, p: number, k: number): number => {
  return combination(k - 1, r - 1) * Math.pow(p, r) * Math.pow(1 - p, k - r);
};

const poissonPMF = (lambda: number, k: number): number => {
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
};

// Continuous Distribution Functions
const normalPDF = (x: number, mu: number, sigma: number): number => {
  return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
};

const normalCDF = (x: number, mu: number, sigma: number): number => {
  const z = (x - mu) / sigma;
  return 0.5 * (1 + erf(z / Math.sqrt(2)));
};

const erf = (x: number): number => {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
};

const exponentialPDF = (x: number, lambda: number): number => {
  return x >= 0 ? lambda * Math.exp(-lambda * x) : 0;
};

const exponentialCDF = (x: number, lambda: number): number => {
  return x >= 0 ? 1 - Math.exp(-lambda * x) : 0;
};

const uniformPDF = (x: number, a: number, b: number): number => {
  return x >= a && x <= b ? 1 / (b - a) : 0;
};

const uniformCDF = (x: number, a: number, b: number): number => {
  if (x < a) return 0;
  if (x > b) return 1;
  return (x - a) / (b - a);
};

const gammaPDF = (x: number, k: number, theta: number): number => {
  if (x <= 0) return 0;
  return (Math.pow(x, k - 1) * Math.exp(-x / theta)) / (Math.pow(theta, k) * gamma(k));
};

const gamma = (z: number): number => {
  if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  z -= 1;
  let x = 0.99999999999980993;
  const p = [676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  for (let i = 0; i < 8; i++) x += p[i] / (z + i + 1);
  const t = z + 7.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
};


const ContinuousDistributions: React.FC = () => {
  const [distType, setDistType] = useState<string>('normal');
  const [mu, setMu] = useState<number>(0);
  const [sigma, setSigma] = useState<number>(1);
  const [lambda, setLambda] = useState<number>(1);
  const [a, setA] = useState<number>(0);
  const [b, setB] = useState<number>(1);
  const [k, setK] = useState<number>(2);
  const [theta, setTheta] = useState<number>(2);
  const [xValue, setXValue] = useState<number>(0);
  const [result, setResult] = useState<ContinuousResult | null>(null);

  const calculateProbability = (): void => {
    let pdf = 0;
    let cdf: number | undefined = 0;
    let mean = 0;
    let variance = 0;

    if (distType === 'normal') {
      pdf = normalPDF(xValue, mu, sigma);
      cdf = normalCDF(xValue, mu, sigma);
      mean = mu;
      variance = sigma * sigma;
    } else if (distType === 'standardNormal') {
      pdf = normalPDF(xValue, 0, 1);
      cdf = normalCDF(xValue, 0, 1);
      mean = 0;
      variance = 1;
    } else if (distType === 'exponential') {
      pdf = exponentialPDF(xValue, lambda);
      cdf = exponentialCDF(xValue, lambda);
      mean = 1 / lambda;
      variance = 1 / (lambda * lambda);
    } else if (distType === 'standardExponential') {
      pdf = exponentialPDF(xValue, 1);
      cdf = exponentialCDF(xValue, 1);
      mean = 1;
      variance = 1;
    } else if (distType === 'uniform') {
      pdf = uniformPDF(xValue, a, b);
      cdf = uniformCDF(xValue, a, b);
      mean = (a + b) / 2;
      variance = Math.pow(b - a, 2) / 12;
    } else if (distType === 'standardUniform') {
      pdf = uniformPDF(xValue, 0, 1);
      cdf = uniformCDF(xValue, 0, 1);
      mean = 0.5;
      variance = 1 / 12;
    } else if (distType === 'gamma') {
      pdf = gammaPDF(xValue, k, theta);
      cdf = undefined;
      mean = k * theta;
      variance = k * theta * theta;
    }

    setResult({ pdf, cdf, mean, variance });
  };

  const generateChartData = (): ChartData => {
    const labels: string[] = [];
    const pdfData: number[] = [];
    const cdfData: number[] = [];
    let start: number, end: number, step: number;

    if (distType === 'normal') {
      start = mu - 4 * sigma;
      end = mu + 4 * sigma;
      step = (end - start) / 100;
    } else if (distType === 'standardNormal') {
      start = -4;
      end = 4;
      step = 0.08;
    } else if (distType === 'exponential' || distType === 'standardExponential') {
      start = 0;
      end = distType === 'exponential' ? 5 / lambda : 5;
      step = end / 100;
    } else if (distType === 'uniform') {
      start = a - 1;
      end = b + 1;
      step = (end - start) / 100;
    } else if (distType === 'standardUniform') {
      start = -0.5;
      end = 1.5;
      step = 0.02;
    } else {
      start = 0;
      end = k * theta + 4 * Math.sqrt(k) * theta;
      step = end / 100;
    }

    for (let x = start; x <= end; x += step) {
      labels.push(x.toFixed(2));
      if (distType === 'normal') {
        pdfData.push(normalPDF(x, mu, sigma));
        cdfData.push(normalCDF(x, mu, sigma));
      } else if (distType === 'standardNormal') {
        pdfData.push(normalPDF(x, 0, 1));
        cdfData.push(normalCDF(x, 0, 1));
      } else if (distType === 'exponential') {
        pdfData.push(exponentialPDF(x, lambda));
        cdfData.push(exponentialCDF(x, lambda));
      } else if (distType === 'standardExponential') {
        pdfData.push(exponentialPDF(x, 1));
        cdfData.push(exponentialCDF(x, 1));
      } else if (distType === 'uniform') {
        pdfData.push(uniformPDF(x, a, b));
        cdfData.push(uniformCDF(x, a, b));
      } else if (distType === 'standardUniform') {
        pdfData.push(uniformPDF(x, 0, 1));
        cdfData.push(uniformCDF(x, 0, 1));
      } else if (distType === 'gamma') {
        pdfData.push(gammaPDF(x, k, theta));
      }
    }

    const datasets = [
      {
        label: 'PDF',
        data: pdfData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      }
    ];

    if (distType !== 'gamma') {
      datasets.push({
        label: 'CDF',
        data: cdfData,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      });
    }

    return { labels, datasets };
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Continuous Probability Distributions</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Distribution Type</label>
          <select value={distType} onChange={(e) => setDistType(e.target.value)} className="w-full p-2 border rounded">
            <option value="normal">Normal Distribution</option>
            <option value="standardNormal">Standard Normal Distribution</option>
            <option value="exponential">Exponential Distribution</option>
            <option value="standardExponential">Standard Exponential Distribution</option>
            <option value="uniform">Uniform Distribution</option>
            <option value="standardUniform">Standard Uniform Distribution</option>
            <option value="gamma">Gamma Distribution</option>
          </select>
        </div>

        {distType === 'normal' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mean (μ)</label>
              <input type="number" step="0.1" value={mu} onChange={(e) => setMu(parseFloat(e.target.value))} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Standard Deviation (σ)</label>
              <input type="number" step="0.1" min="0.1" value={sigma} onChange={(e) => setSigma(parseFloat(e.target.value))} className="w-full p-2 border rounded" />
            </div>
          </>
        )}

        {distType === 'exponential' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rate (λ)</label>
            <input type="number" step="0.1" min="0.1" value={lambda} onChange={(e) => setLambda(parseFloat(e.target.value))} className="w-full p-2 border rounded" />
          </div>
        )}

        {distType === 'uniform' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lower Bound (a)</label>
              <input type="number" step="0.1" value={a} onChange={(e) => setA(parseFloat(e.target.value))} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upper Bound (b)</label>
              <input type="number" step="0.1" value={b} onChange={(e) => setB(parseFloat(e.target.value))} className="w-full p-2 border rounded" />
            </div>
          </>
        )}

        {distType === 'gamma' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shape (k)</label>
              <input type="number" step="0.1" min="0.1" value={k} onChange={(e) => setK(parseFloat(e.target.value))} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Scale (θ)</label>
              <input type="number" step="0.1" min="0.1" value={theta} onChange={(e) => setTheta(parseFloat(e.target.value))} className="w-full p-2 border rounded" />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">X Value</label>
          <input type="number" step="0.1" value={xValue} onChange={(e) => setXValue(parseFloat(e.target.value))} className="w-full p-2 border rounded" />
        </div>
      </div>

      <button onClick={calculateProbability} className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition">
        Calculate Probability
      </button>

      {result && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Results:</h3>
          <p className="text-gray-700">PDF at x: <span className="font-bold">{result.pdf.toFixed(6)}</span></p>
          {result.cdf !== undefined && <p className="text-gray-700">CDF at x (P(X ≤ x)): <span className="font-bold">{result.cdf.toFixed(6)}</span></p>}
          <p className="text-gray-700">Mean (μ): <span className="font-bold">{result.mean.toFixed(4)}</span></p>
          <p className="text-gray-700">Variance (σ²): <span className="font-bold">{result.variance.toFixed(4)}</span></p>
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Probability Distribution</h3>
        <Line data={generateChartData()} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
      </div>
    </div>
  );
};

const DataCollectionSection: React.FC = () => {
  const [distParams, setDistParams] = useState<{ mean: number; stdDev: number }>({ mean: 0, stdDev: 0 });

  useEffect(() => {
    if (collectedData.length > 0) {
      const mean = collectedData.reduce((a, b) => a + b, 0) / collectedData.length;
      const variance = collectedData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / collectedData.length;
      setDistParams({ mean, stdDev: Math.sqrt(variance) });
    }
  }, []);

  const getDataStatistics = () => {
    if (collectedData.length === 0) return null;
    
    const sorted = [...collectedData].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const range = max - min;
    const median = sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];
    
    return { min, max, range, median };
  };

  const stats = getDataStatistics();

  const generateHistogram = (): ChartData => {
    if (collectedData.length === 0) {
      return {
        labels: [],
        datasets: [{
          label: 'Frequency',
          data: [],
          backgroundColor: 'rgba(147, 51, 234, 0.5)',
          borderColor: 'rgb(147, 51, 234)',
          borderWidth: 1,
        }],
      };
    }

    const sorted = [...collectedData].sort((a, b) => a - b);
    const min = Math.min(...collectedData);
    const max = Math.max(...collectedData);
    const range = max - min;
    
    // Use Sturges' rule for bin count, but cap between 5 and 30
    const sturgesBins = Math.ceil(Math.log2(collectedData.length) + 1);
    const binCount = Math.max(5, Math.min(30, sturgesBins));
    const binSize = range / binCount;
    
    const bins: number[] = new Array(binCount).fill(0);
    const labels: string[] = [];
    
    // Determine decimal places based on range
    let decimalPlaces = 0;
    if (range < 1) decimalPlaces = 3;
    else if (range < 10) decimalPlaces = 2;
    else if (range < 100) decimalPlaces = 1;
    else if (range >= 1000) decimalPlaces = 0;
    else decimalPlaces = 1;
    
    for (let i = 0; i < binCount; i++) {
      const binStart = min + i * binSize;
      const binEnd = binStart + binSize;
      
      // Format numbers appropriately for the scale
      if (range >= 1000) {
        labels.push(`${Math.round(binStart)}-${Math.round(binEnd)}`);
      } else {
        labels.push(`${binStart.toFixed(decimalPlaces)}-${binEnd.toFixed(decimalPlaces)}`);
      }
    }
    
    collectedData.forEach(val => {
      let binIndex = Math.floor((val - min) / binSize);
      // Handle edge case where value equals max
      if (binIndex >= binCount) binIndex = binCount - 1;
      if (binIndex < 0) binIndex = 0;
      bins[binIndex]++;
    });

    return {
      labels,
      datasets: [{
        label: 'Frequency',
        data: bins,
        backgroundColor: 'rgba(147, 51, 234, 0.5)',
        borderColor: 'rgb(147, 51, 234)',
        borderWidth: 1,
      }],
    };
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Data Collection & Distribution Fitting</h2>
      
      <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
        <p className="text-sm text-purple-800">
          <strong>Your collected data is imported from:</strong> <code className="bg-purple-100 px-2 py-1 rounded">app/data/collectedData.ts</code>
        </p>
        <p className="text-sm text-purple-800 mt-2">
          The data is automatically used to calculate the distribution parameters below.
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Collected Data ({collectedData.length} points):</h3>
        <div className="max-h-40 overflow-y-auto bg-white p-3 rounded border">
          <p className="text-sm text-gray-700 font-mono">{collectedData.join(', ')}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900">Mean (μ)</h4>
          <p className="text-2xl font-bold text-blue-600">{distParams.mean.toFixed(4)}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-900">Std Dev (σ)</h4>
          <p className="text-2xl font-bold text-green-600">{distParams.stdDev.toFixed(4)}</p>
        </div>
        {stats && (
          <>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-900">Median</h4>
              <p className="text-2xl font-bold text-orange-600">{stats.median.toFixed(4)}</p>
            </div>
            <div className="bg-pink-50 p-4 rounded-lg">
              <h4 className="font-semibold text-pink-900">Range</h4>
              <p className="text-2xl font-bold text-pink-600">{stats.range.toFixed(4)}</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h4 className="font-semibold text-indigo-900">Minimum</h4>
              <p className="text-2xl font-bold text-indigo-600">{stats.min.toFixed(4)}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900">Maximum</h4>
              <p className="text-2xl font-bold text-purple-600">{stats.max.toFixed(4)}</p>
            </div>
          </>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Data Histogram</h3>
        <Bar data={generateHistogram()} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('continuous');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Probability Distribution Calculator
          </h1>
          <p className="text-center text-gray-600">Continuous Distributions</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="flex gap-2 mb-6 border-b">
            <button
              onClick={() => setActiveTab('continuous')}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === 'continuous'
                  ? 'border-b-2 border-green-500 text-green-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Continuous Distributions
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === 'data'
                  ? 'border-b-2 border-purple-500 text-purple-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Data Collection
            </button>
          </div>

          {activeTab === 'continuous' && <ContinuousDistributions />}
          {activeTab === 'data' && <DataCollectionSection />}
        </div>
      </div>
    </div>
  );
}