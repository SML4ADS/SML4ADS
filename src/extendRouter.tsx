
import React, { ReactElement } from "react";
import { Route } from "react-router-dom";
import AdversarialAttack from "./components/extends/AdversarialAttack";
import CausalBasedImitationLearning from "./components/extends/CausalBasedImitationLearning";
import CausalBayesianGenerationFuzzyTest from "./components/extends/CausalBayesianGenerationFuzzyTest";
import CausalInference from "./components/extends/CausalInference";
import CriticalScenarios from "./components/extends/CriticalScenarios";
import CriticalSpecificScenarios from "./components/extends/CriticalSpecificScenarios";
import IntervalizedWFA from "./components/extends/IntervalizedWFA";
import MultimodalLLM from "./components/extends/MultimodalLLM";
import OnlineMonitor from "./components/extends/OnlineMonitor";
import PerceptualModelTraining from "./components/extends/PerceptualModelTraining";
import RLModeling from "./components/extends/RLModeling";
import RLTraining from "./components/extends/RLTraining";
import RiskModelingAnalysis from "./components/extends/RiskModelingAnalysis";
import ScenarioLibrary from "./components/extends/ScenarioLibrary";
import SimulationTest from "./components/extends/SimulationTest";
import TimeSeriesAnalysis from "./components/extends/TimeSeriesAnalysis";
import TimeSeriesClustering from "./components/extends/TimeSeriesClustering";

const extendRouter = (): ReactElement => {
  return (
    <React.Fragment>
      <Route path="/adversarialAttack" element={<AdversarialAttack />} />
<Route path="/causalBasedImitationLearning" element={<CausalBasedImitationLearning />} />
<Route path="/causalBayesianGenerationFuzzyTest" element={<CausalBayesianGenerationFuzzyTest />} />
<Route path="/causalInference" element={<CausalInference />} />
<Route path="/criticalScenarios" element={<CriticalScenarios />} />
<Route path="/criticalSpecificScenarios" element={<CriticalSpecificScenarios />} />
<Route path="/intervalizedWFA" element={<IntervalizedWFA />} />
<Route path="/multimodalLLM" element={<MultimodalLLM />} />
<Route path="/onlineMonitor" element={<OnlineMonitor />} />
<Route path="/perceptualModelTraining" element={<PerceptualModelTraining />} />
<Route path="/rLModeling" element={<RLModeling />} />
<Route path="/rLTraining" element={<RLTraining />} />
<Route path="/riskModelingAnalysis" element={<RiskModelingAnalysis />} />
<Route path="/scenarioLibrary" element={<ScenarioLibrary />} />
<Route path="/simulationTest" element={<SimulationTest />} />
<Route path="/timeSeriesAnalysis" element={<TimeSeriesAnalysis />} />
<Route path="/timeSeriesClustering" element={<TimeSeriesClustering />} />
    </React.Fragment>
  );
};

export default extendRouter;
  