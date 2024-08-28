Input Data
The /predict endpoint expects a JSON payload with the following fields:

Distance: (float) The distance in kilometers.
ShipmentType: (int) The type of shipment. Valid values are 1, 2, or 3.
NumPackages: (int) The number of packages. Must be greater than 0.
SpecialHandling: (int) Indicates if special handling is required. Valid values are 0 (No) or 1 (Yes).
PackageWeight: (float) The weight of the package(s) in kilograms.
