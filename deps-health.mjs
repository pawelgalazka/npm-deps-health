#!/usr/bin/env node
import fs from "fs"
import semverDiff from "semver-diff"

const pck = JSON.parse(fs.readFileSync("./package.json"))
const input = JSON.parse(fs.readFileSync(0, "utf-8"))

const depsCount =
  Object.keys(pck.dependencies).length + Object.keys(pck.devDependencies).length

let outdatedScore = 0
let outdatedPatch = 0
let outdatedMinor = 0
let outdatedMajor = 0
let outdatedDeps = 0

for (const [depName, depDetails] of Object.entries(input)) {
  const diff = semverDiff(depDetails.current, depDetails.latest)
  outdatedDeps++
  if (diff === "patch") {
    outdatedScore += 0.2
    outdatedPatch++
  } else if (diff === "minor") {
    outdatedScore += 0.5
    outdatedMinor++
  } else if (diff === "major") {
    outdatedScore += 1
    outdatedMajor++
  }
}

console.log("Dependencies count:", depsCount)
console.log(
  "Outdated deps:",
  outdatedDeps,
  `(${Math.round((outdatedDeps / depsCount) * 100)}%)`
)
console.log("Outdated patch deps:", outdatedPatch)
console.log("Outdated minor deps:", outdatedMinor)
console.log("Outdated major deps:", outdatedMajor)
console.log(
  "Deps health score:",
  Math.round(((depsCount - outdatedScore) / depsCount) * 100),
  "/100"
)
