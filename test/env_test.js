const assert = require("assert");
const {
  tiMonth,
  fuelEnergySelector,
  fuelConsumption,
  combustionConsumption,
  electricalConsumption,
  costElectricalKM,
  fuelEfficiency,
  energyKm,
  emisionKm,
  savedEnergy,
  avoidedEmissions,
  monthlySavings,
  annualSavings,
  fuelCostKm,
  youngTree,
  oldTree,
  energyH2Cylinders,
  energyH2LowPresure,
  energyConsumed,
  hydrogenMass,
  litersRequired,
} = require("../calculators/environment");

const dataDummy = require("../calculators/ejercicio").dummyDataSet()
// Datos base para los tests (basados en dataDummy)
describe("Environment Calculator Tests", () => {
  
  // Variables compartidas para los tests - usando dataDummy
  const testIPC = 2.8;
  const nominalEnergy = 81.14;
  const autonomyNominal = 200;
  const annualUse = dataDummy.base_km;
  const fuelPrice = 1.2;
  const energyPrice = 1;
  const emissionFactor = dataDummy.emision_factor_diesel;
  const combustionConsumptionValue = 50.6;

  describe("tiMonth", () => {
    it("should calculate monthly interest rate correctly with IPC 2.8", () => {
      const result = tiMonth(testIPC);
      assert.strictEqual(result, 0.0023039138595752906);
    });

    it("should calculate monthly interest rate correctly with IPC 5.0", () => {
      const result = tiMonth(5.0);
      assert.strictEqual(typeof result, "number");
      assert.ok(result > 0);
    });
  });

  describe("fuelEnergySelector", () => {
    it("should return gasoline data when fuel type is 'gasoline'", () => {
      assert.deepStrictEqual(fuelEnergySelector("gasoline"), {
        fuel_price: 16700,
        fuel_energy: dataDummy.gasoline_energy,
        emision_factor: dataDummy.emision_factor_gasoline,
      });
    });

    it("should return gasoline data when fuel type is 'Gasoline' (capitalized)", () => {
      assert.deepStrictEqual(fuelEnergySelector("Gasoline"), {
        fuel_price: 16700,
        fuel_energy: dataDummy.gasoline_energy,
        emision_factor: dataDummy.emision_factor_gasoline,
      });
    });

    it("should return diesel data when fuel type is 'diesel'", () => {
      assert.deepStrictEqual(fuelEnergySelector("diesel"), {
        fuel_price: 11795,
        fuel_energy: dataDummy.diesel_energy,
        emision_factor: dataDummy.emision_factor_diesel,
      });
    });

    it("should return diesel data when fuel type is 'Diesel' (capitalized)", () => {
      assert.deepStrictEqual(fuelEnergySelector("Diesel"), {
        fuel_price: 11795,
        fuel_energy: dataDummy.diesel_energy,
        emision_factor: dataDummy.emision_factor_diesel,
      });
    });

    it("should return error object for invalid fuel type", () => {
      const result = fuelEnergySelector("invalid");
      assert.ok(result.error);
      assert.strictEqual(result.error_code, 500);
    });
  });

  describe("electricalConsumption", () => {
    it("should calculate electrical consumption correctly with standard values", () => {
      const result = electricalConsumption(nominalEnergy, autonomyNominal);
      assert.strictEqual(result, 0.45077777777777775);
    });

    it("should return positive value", () => {
      const result = electricalConsumption(100, 250);
      assert.ok(result > 0);
    });
  });

  describe("costElectricalKM", () => {
    it("should calculate cost per km for electrical consumption", () => {
      const electrical_consumption = electricalConsumption(nominalEnergy, autonomyNominal);
      const result = costElectricalKM(electrical_consumption, energyPrice);
      assert.strictEqual(typeof result, "number");
      assert.ok(result > 0);
    });

    it("should calculate correctly with energy price 1 and consumption 100", () => {
      const result = costElectricalKM(1, 100);
      assert.strictEqual(result, 100);
    });
  });

  describe("combustionConsumption", () => {
    it("should calculate combustion consumption from electrical consumption", () => {
      const electrical_consumption = electricalConsumption(nominalEnergy, autonomyNominal);
      const result = combustionConsumption(electrical_consumption);
      assert.strictEqual(result, 1.6695473251028808);
    });

    it("should calculate combustion consumption with value 50.6", () => {
      const result = combustionConsumption(combustionConsumptionValue);
      assert.strictEqual(typeof result, "number");
      assert.ok(result > 0);
    });
  });

  describe("fuelConsumption", () => {
    it("should calculate fuel consumption with diesel energy factor", () => {
      const fuelInfo = fuelEnergySelector("diesel");
      const combustion_consumption = combustionConsumption(combustionConsumptionValue);
      const result = fuelConsumption(combustion_consumption, fuelInfo.fuel_energy);
      assert.strictEqual(typeof result, "number");
      assert.ok(result > 0);
    });

    it("should calculate fuel consumption with gasoline energy factor", () => {
      const fuelInfo = fuelEnergySelector("gasoline");
      const combustion_consumption = combustionConsumption(combustionConsumptionValue);
      const result = fuelConsumption(combustion_consumption, fuelInfo.fuel_energy);
      assert.strictEqual(typeof result, "number");
      assert.ok(result > 0);
    });
  });

  describe("fuelEfficiency", () => {
    it("should calculate fuel efficiency correctly", () => {
      const fuelInfo = fuelEnergySelector("diesel");
      const combustion_consumption = combustionConsumption(combustionConsumptionValue);
      const fuel_consumption = fuelConsumption(combustion_consumption, fuelInfo.fuel_energy);
      const result = fuelEfficiency(fuel_consumption);
      assert.strictEqual(typeof result, "number");
      assert.ok(result > 0);
    });
  });

  describe("fuelCostKm", () => {
    it("should calculate fuel cost per km correctly", () => {
      const fuelInfo = fuelEnergySelector("diesel");
      const combustion_consumption = combustionConsumption(combustionConsumptionValue);
      const fuel_consumption = fuelConsumption(combustion_consumption, fuelInfo.fuel_energy);
      const result = fuelCostKm(fuelPrice, fuel_consumption);
      assert.strictEqual(typeof result, "number");
      assert.ok(result > 0);
    });
  });

  describe("energyKm", () => {
    it("should calculate energy per km correctly", () => {
      const combustion_consumption = combustionConsumption(combustionConsumptionValue);
      const result = energyKm(combustion_consumption);
      assert.strictEqual(typeof result, "number");
      assert.ok(result > 0);
    });

    it("should convert to joules correctly", () => {
      const result = energyKm(50.6);
      // Verificar que la conversión a joules es correcta (3.6 * 10^6)
      assert.ok(result > 100000000); // Debería ser un número grande
    });
  });

  describe("emisionKm", () => {
    it("should calculate emissions per km correctly", () => {
      const combustion_consumption = combustionConsumption(combustionConsumptionValue);
      const energy_km = energyKm(combustion_consumption);
      const result = emisionKm(emissionFactor, energy_km);
      assert.strictEqual(typeof result, "number");
      assert.ok(result > 0);
    });
  });

  describe("savedEnergy", () => {
    it("should calculate saved energy correctly with annual use", () => {
      const electrical_consumption = electricalConsumption(nominalEnergy, autonomyNominal);
      const combustion_consumption = combustionConsumption(combustionConsumptionValue);
      const result = savedEnergy(combustion_consumption, electrical_consumption, annualUse);
      assert.strictEqual(typeof result, "number");
      // La energía ahorrada debería ser positiva si el combustión > eléctrico
      assert.ok(result !== 0);
    });
  });

  describe("avoidedEmissions", () => {
    it("should calculate avoided emissions correctly", () => {
      const combustion_consumption = combustionConsumption(combustionConsumptionValue);
      const energy_km = energyKm(combustion_consumption);
      const emission_km = emisionKm(emissionFactor, energy_km);
      const result = avoidedEmissions(emission_km, annualUse);
      assert.strictEqual(typeof result, "number");
      assert.ok(result > 0);
    });
  });

  describe("monthlySavings", () => {
    it("should calculate monthly savings correctly", () => {
      const fuelInfo = fuelEnergySelector("diesel");
      const combustion_consumption = combustionConsumption(combustionConsumptionValue);
      const fuel_consumption = fuelConsumption(combustion_consumption, fuelInfo.fuel_energy);
      const fuel_cost_km = fuelCostKm(fuelPrice, fuel_consumption);
      const cost_electrical_km = costElectricalKM(1, 100);
      const result = monthlySavings(fuel_cost_km, cost_electrical_km, annualUse);
      assert.strictEqual(typeof result, "number");
    });
  });

  describe("annualSavings", () => {
    it("should calculate annual savings with IPC correctly", () => {
      const fuelInfo = fuelEnergySelector("diesel");
      const combustion_consumption = combustionConsumption(combustionConsumptionValue);
      const fuel_consumption = fuelConsumption(combustion_consumption, fuelInfo.fuel_energy);
      const fuel_cost_km = fuelCostKm(fuelPrice, fuel_consumption);
      const cost_electrical_km = costElectricalKM(1, 100);
      const monthly_savings = monthlySavings(fuel_cost_km, cost_electrical_km, annualUse);
      const ipc = tiMonth(testIPC);
      const result = annualSavings(monthly_savings, ipc);
      assert.strictEqual(typeof result, "number");
    });
  });

  describe("youngTree", () => {
    it("should calculate equivalent young trees correctly", () => {
      const combustion_consumption = combustionConsumption(combustionConsumptionValue);
      const energy_km = energyKm(combustion_consumption);
      const emission_km = emisionKm(emissionFactor, energy_km);
      const avoided_emissions = avoidedEmissions(emission_km, annualUse);
      const result = youngTree(avoided_emissions);
      assert.strictEqual(typeof result, "number");
      assert.ok(Number.isInteger(result));
    });
  });

  describe("oldTree", () => {
    it("should calculate equivalent old trees correctly", () => {
      const combustion_consumption = combustionConsumption(combustionConsumptionValue);
      const energy_km = energyKm(combustion_consumption);
      const emission_km = emisionKm(emissionFactor, energy_km);
      const avoided_emissions = avoidedEmissions(emission_km, annualUse);
      const result = oldTree(avoided_emissions);
      assert.strictEqual(typeof result, "number");
      assert.ok(Number.isInteger(result));
    });
  });

  describe("energyH2Cylinders", () => {
    it("should calculate hydrogen energy in cylinders correctly", () => {
      const result = energyH2Cylinders(nominalEnergy);
      assert.strictEqual(typeof result, "number");
      assert.ok(result > 0);
    });
  });

  describe("energyH2LowPresure", () => {
    it("should calculate hydrogen energy at low pressure correctly", () => {
      const energy_H2_Cylinders = energyH2Cylinders(nominalEnergy);
      const result = energyH2LowPresure(energy_H2_Cylinders);
      assert.strictEqual(typeof result, "number");
      assert.ok(result > 0);
    });
  });

  describe("energyConsumed", () => {
    it("should calculate total energy consumed correctly", () => {
      const energy_H2_Cylinders = energyH2Cylinders(nominalEnergy);
      const energy_H2_Low_Presure = energyH2LowPresure(energy_H2_Cylinders);
      const result = energyConsumed(energy_H2_Low_Presure);
      assert.strictEqual(typeof result, "number");
      assert.ok(result > 0);
    });
  });

  describe("hydrogenMass", () => {
    it("should calculate hydrogen mass correctly", () => {
      const energy_H2_Cylinders = energyH2Cylinders(nominalEnergy);
      const energy_H2_Low_Presure = energyH2LowPresure(energy_H2_Cylinders);
      const result = hydrogenMass(energy_H2_Low_Presure);
      assert.strictEqual(typeof result, "number");
      assert.ok(result > 0);
    });
  });

  describe("litersRequired", () => {
    it("should calculate liters of water required correctly", () => {
      const energy_H2_Cylinders = energyH2Cylinders(nominalEnergy);
      const energy_H2_Low_Presure = energyH2LowPresure(energy_H2_Cylinders);
      const hydrogen_mass = hydrogenMass(energy_H2_Low_Presure);
      const result = litersRequired(hydrogen_mass);
      assert.strictEqual(typeof result, "number");
      assert.ok(result > 0);
    });
  });

  // Test de integración completo (simulando el flujo del network.js)
  describe("Integration Test - Complete Flow", () => {
    it("should execute complete calculation flow like network.js", () => {
      const ipc = tiMonth(testIPC);
      const fes = fuelEnergySelector("diesel");
      const electrical_consumption = electricalConsumption(nominalEnergy, autonomyNominal);
      const cost_electrical_km = costElectricalKM(1, 100);
      const combustion_consumption = combustionConsumption(combustionConsumptionValue);
      const fuel_consumption = fuelConsumption(combustion_consumption, fes.fuel_energy);
      const fuel_efficiency = fuelEfficiency(fuel_consumption);
      const fuel_cost_km = fuelCostKm(fuelPrice, fuel_consumption);
      const energy_km = energyKm(combustion_consumption);
      const emission_km = emisionKm(emissionFactor, energy_km);
      const saved_energy = savedEnergy(combustion_consumption, electrical_consumption, annualUse);
      const avoided_emissions = avoidedEmissions(emission_km, annualUse);
      const monthly_savings = monthlySavings(fuel_cost_km, cost_electrical_km, annualUse);
      const annual_savings = annualSavings(monthly_savings, ipc);
      const young_tree = youngTree(avoided_emissions);
      const old_tree = oldTree(avoided_emissions);
      const energy_H2_Cylinders = energyH2Cylinders(nominalEnergy);
      const energy_H2_Low_Presure = energyH2LowPresure(energy_H2_Cylinders);
      const energy_consumed = energyConsumed(energy_H2_Low_Presure);
      const hydrogen_mass = hydrogenMass(energy_H2_Low_Presure);
      const liters_required = litersRequired(hydrogen_mass);

      // Verificar que todos los cálculos retornan valores válidos
      assert.strictEqual(typeof ipc, "number");
      assert.ok(fes.fuel_price);
      assert.ok(fes.fuel_energy);
      assert.ok(fes.emision_factor);
      assert.strictEqual(typeof electrical_consumption, "number");
      assert.strictEqual(typeof cost_electrical_km, "number");
      assert.strictEqual(typeof combustion_consumption, "number");
      assert.strictEqual(typeof fuel_consumption, "number");
      assert.strictEqual(typeof fuel_efficiency, "number");
      assert.strictEqual(typeof fuel_cost_km, "number");
      assert.strictEqual(typeof energy_km, "number");
      assert.strictEqual(typeof emission_km, "number");
      assert.strictEqual(typeof saved_energy, "number");
      assert.strictEqual(typeof avoided_emissions, "number");
      assert.strictEqual(typeof monthly_savings, "number");
      assert.strictEqual(typeof annual_savings, "number");
      assert.strictEqual(typeof young_tree, "number");
      assert.strictEqual(typeof old_tree, "number");
      assert.strictEqual(typeof energy_H2_Cylinders, "number");
      assert.strictEqual(typeof energy_H2_Low_Presure, "number");
      assert.strictEqual(typeof energy_consumed, "number");
      assert.strictEqual(typeof hydrogen_mass, "number");
      assert.strictEqual(typeof liters_required, "number");
    });
  });
});

