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
    outdatedScore += 0.1
    outdatedPatch++
  } else if (diff === "minor") {
    outdatedScore += 0.25
    outdatedMinor++
  } else if (diff === "major") {
    outdatedScore += 1
    outdatedMajor++
    console.log(
      "Outdated major dep:",
      depName,
      depDetails.current,
      depDetails.latest
    )
  }
}

console.log("\n========== SUMMARY ==========")
console.log("Dependencies count:", depsCount)
console.log(
  "Outdated deps:",
  outdatedDeps,
  `(${Math.round((outdatedDeps / depsCount) * 100)}%)`
)
console.log(
  "Outdated patch deps:",
  outdatedPatch,
  `(${Math.round((outdatedPatch / depsCount) * 100)}%)`
)
console.log(
  "Outdated minor deps:",
  outdatedMinor,
  `(${Math.round((outdatedMinor / depsCount) * 100)}%)`
)
console.log(
  "Outdated major deps:",
  outdatedMajor,
  `(${Math.round((outdatedMajor / depsCount) * 100)}%)`
)
console.log(
  "Deps health score:",
  Math.round(((depsCount - outdatedScore) / depsCount) * 100),
  "/100"
)
