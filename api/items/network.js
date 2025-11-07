const { Router } = require('express');
const response = require('../../network/response')
const router = Router();
const ctrl = require('./index');
const {tiMonth, fuelEnergySelector, electricalConsumption, costElectricalKM, combustionConsumption, fuelConsumption, fuelEfficiency, fuelCostKm, energyKm, emisionKm, savedEnergy, avoidedEmissions, monthlySavings, annualSavings, youngTree, oldTree, energyH2Cylinders, energyH2LowPresure, energyConsumed, hydrogenMass, litersRequired} = require('../../calculators/environment')

const tableInjected = 'my_table'

router.get('/enviroment/:ipc/:fuel', (req, res) => {
    try {
        let list = {};

        const ipc = tiMonth(parseFloat(req.params.ipc));
        const fes = fuelEnergySelector(req.params.fuel);
        const electrical_consumption = electricalConsumption(81.14, 200);
        const cost_electrical_km = costElectricalKM(1,100);
        const combustion_consumption = combustionConsumption(50.6);
        const fuel_consumption = fuelConsumption(combustion_consumption,fes['fuel_energy']);
        const fuel_efficiency = fuelEfficiency(fuel_consumption);
        const fuel_cost_km = fuelCostKm(1.2, fuel_consumption);
        const energy_km = energyKm(combustion_consumption);
        const emission_km = emisionKm(0.25, energy_km);
        const saved_energy = savedEnergy(combustion_consumption, electrical_consumption, 20000);
        const avoided_emissions = avoidedEmissions(emission_km, 20000);
        const monthly_savings = monthlySavings(fuel_cost_km, cost_electrical_km, 20000);
        const annual_savings = annualSavings(monthly_savings, ipc);
        const young_tree =  youngTree(avoided_emissions);
        console.log(avoided_emissions, young_tree)
        const old_tree =  oldTree(avoided_emissions);
        const energy_H2_Cylinders =  energyH2Cylinders(81.14);
        const energy_H2_Low_Presure =  energyH2LowPresure(energy_H2_Cylinders);
        const energy_consumed =  energyConsumed(energy_H2_Low_Presure);
        const hydrogen_mass =  hydrogenMass(energy_H2_Low_Presure);
        const liters_reqired =  litersRequired(hydrogen_mass);


        list["ti_month"] = ipc;
        list['fuel_energy_selector'] = fes;
        list['electrical_consumption'] = electrical_consumption;
        list['cost_electrical_km'] = cost_electrical_km;
        list['combustion_consumption'] = combustion_consumption;
        list['fuel_consumption'] = fuel_consumption;
        list['fuel_efficiency'] = fuel_efficiency;
        list['fuel_cost_km'] = fuel_cost_km;
        list['energy_km'] = energy_km;
        list['emission_km'] = emission_km;
        list['saved_energy'] = saved_energy;
        list['avoided_emissions'] = avoided_emissions;
        list['monthly_savings'] = monthly_savings;
        list['annual_savings'] = annual_savings;
        list['young_tree'] = young_tree;
        list['old_tree'] = old_tree;
        list['energy_H2_Cylinders'] = energy_H2_Cylinders;
        list['energy_H2_Low_Presure'] = energy_H2_Low_Presure;
        list['energy_consumed'] = energy_consumed;
        list['hydrogen_mass'] = hydrogen_mass;
        list['liters_reqired'] = liters_reqired;
        
        response.success(req, res, list, 200);
    } catch (error) {
        response.error(req, res, error.message, 500); 
    }
})


module.exports = router ;