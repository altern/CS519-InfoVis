window.debug = true

function firstCol(i, offset) {
    return offset + i*2;
}
function secondCol(i, offset) {
    return offset + i*2 + 1;
}

function dec(a) {
    return --a;
}
/*var data = {}
data.mainlineTags = [
    {version: "x.1", sequence: 1, from: c.MAINLINE_LEVEL, to: c.MAINLINE_DEV_LEVEL},
    {version: "x.2", sequence: 2, from: c.MAINLINE_LEVEL, to: c.MAINLINE_TEST_LEVEL},
    {version: "x.8", sequence: 8, from: c.MAINLINE_LEVEL, to: c.MAINLINE_USER_LEVEL},
]

data.experimentalTags = [
    {version: "x.3", sequence: 3, from: c.MAINLINE_LEVEL, to: c.EXPERIMENTAL_TAG_LEVEL},
    {version: "x.9", sequence: 10, from: c.MAINLINE_LEVEL, to: c.EXPERIMENTAL_TAG_LEVEL},
    {version: "x.4", sequence: 4, from: c.EXPERIMENTAL_BRANCH_LEVELS[dec(1)], to: c.EXPERIMENTAL_BRANCH_TEST_LEVELS[dec(1)]},
    {version: "x.6", sequence: 6, from: c.EXPERIMENTAL_BRANCH_LEVELS[dec(1)], to: c.EXPERIMENTAL_BRANCH_USER_LEVELS[dec(1)]},
    {version: "x.10", sequence: 12, from: c.EXPERIMENTAL_BRANCH_LEVELS[dec(2)], to: c.EXPERIMENTAL_BRANCH_TEST_LEVELS[dec(2)]},
    {version: "x.11", sequence: 14, from: c.EXPERIMENTAL_BRANCH_LEVELS[dec(2)], to: c.EXPERIMENTAL_BRANCH_DEV_LEVELS[dec(2)]},
    {version: "x.12", sequence: 16, from: c.EXPERIMENTAL_BRANCH_LEVELS[dec(2)], to: c.EXPERIMENTAL_BRANCH_TEST_LEVELS[dec(2)]},
    {version: "x.13", sequence: 18, from: c.EXPERIMENTAL_BRANCH_LEVELS[dec(2)], to: c.EXPERIMENTAL_BRANCH_USER_LEVELS[dec(2)]},
    {version: "x.14", sequence: 20, from: c.EXPERIMENTAL_BRANCH_LEVELS[dec(2)], to: c.EXPERIMENTAL_BRANCH_USER_LEVELS[dec(2)]},
]
data.releaseTags = [
    {version: "x.5", sequence: 5, from: c.MAINLINE_LEVEL, to: c.RELEASE_TAG_LEVEL},
    {version: "x.7", sequence: 7, from: c.MAINLINE_LEVEL, to: c.RELEASE_TAG_LEVEL},
    {version: "2.0", sequence: 9, from: c.RELEASE_BRANCH_LEVELS[dec(2)], to: c.RELEASE_BRANCH_USER_LEVELS[dec(2)]},
    {version: "1.0", sequence: 11, from: c.RELEASE_BRANCH_LEVELS[dec(1)], to: c.RELEASE_BRANCH_TEST_LEVELS[dec(1)]},
    {version: "1.1", sequence: 13, from: c.RELEASE_BRANCH_LEVELS[dec(1)], to: c.RELEASE_BRANCH_USER_LEVELS[dec(1)]},
    {version: "1.2", sequence: 15, from: c.RELEASE_BRANCH_LEVELS[dec(1)], to: c.RELEASE_BRANCH_RC_LEVELS[dec(1)]},
    {version: "1.3", sequence: 17, from: c.RELEASE_BRANCH_LEVELS[dec(1)], to: c.RELEASE_BRANCH_PROD_LEVELS[dec(1)]},
    {version: "2.1", sequence: 19, from: c.RELEASE_BRANCH_LEVELS[dec(2)], to: c.RELEASE_BRANCH_RC_LEVELS[dec(2)]},
]*/

function addTag (list, tag) {
    if(!$.isArray(list))
        return []
    else 
        return list.concat(tag)
}
function addBranch (list, branch) {
    if(!$.isArray(list))
        return []
    else 
        return list.concat(branch)
}

var isZeroTag = function(obj) {
    //return obj.version == "0.x.x" || obj.version == "0.x" || obj.version == "0"
        //|| obj.version == "0.X.X" || obj.version == "0.X" 
    return obj.version == "0" || obj.version == "x.0" || obj.version == "x.x.0"
      || obj.version == "X.0" || obj.version == "X.X.0"
}
var isMainlineOrExperimentalTagOrReleaseRevision = function(obj) {
    return /x\.\d+/i.test(obj.version) || /^\d+$/.test(obj.version)
        || /\/x\.\d+/i.test(obj.version) || /\/^\d+$/.test(obj.version)
}
var isReleaseRevision = function(obj) {
    return isMainlineOrExperimentalTagOrReleaseRevision(obj) && isReleaseBranch(obj.parentObj)
}
var isMainlineOrExperimentalBranch = function(obj) {
    return obj.version == "x.x" || obj.version == "x"
        || obj.version == "X.X" || obj.version == "X"
}
var isMainlineBranch = function(obj) {
    return isMainlineOrExperimentalBranch(obj) && isZeroTag(obj.parentObj)
}
var isReleaseTag = function(obj, childArr) {
    return /\d+\.\d+/.test(obj.version) 
        || /.*\/\d+\.\d+/.test(obj.version)
}
var isReleaseBranch = function(obj, childArr) {
    return /\d+\.x/i.test(obj.version)
}

var combineParsedTrees = function(tree1, tree2) {
    var resultObj = {
        zeroTagVersion : !$.isEmptyObject(tree1.zeroTagVersion) ? tree1.zeroTagVersion : tree2.zeroTagVersion,
        mainlineBranch : !$.isEmptyObject(tree1.mainlineBranch) ? tree1.mainlineBranch : tree2.mainlineBranch,
        mainlineTags : tree1.mainlineTags.concat(tree2.mainlineTags),
        experimentalBranches : tree1.experimentalBranches.concat(tree2.experimentalBranches),
        experimentalTags : tree1.experimentalTags.concat(tree2.experimentalTags),
        releaseBranches : tree1.releaseBranches.concat(tree2.releaseBranches),
        releaseTags : tree1.releaseTags.concat(tree2.releaseTags),
        releaseRevisions : tree1.releaseRevisions.concat(tree2.releaseRevisions),
    }
    return resultObj
}

var defaultParsedTree = {
    zeroTagVersion : '',
    mainlineBranch : {},
    mainlineTags : [],
    experimentalBranches : [],
    experimentalTags : [],
    releaseBranches : [],
    releaseTags : [],
    releaseRevisions : []
}

function parseArtifactTree ( artifactTree, parentObj ) {
    
    var artifactTreeObj, artifactTreeArr, parsedArtifactTree
    
    artifactTreeObj = artifactTree['value']
    artifactTreeArr = artifactTree['children']
    artifactTreeObj.parentObj = parentObj
    parsedArtifactTree = parseArtifactTreeArr(artifactTreeArr, artifactTreeObj)
    
    if(isZeroTag(artifactTreeObj)) {
        parsedArtifactTree.zeroTagVersion = artifactTreeObj.version
    } else if (isMainlineOrExperimentalTagOrReleaseRevision(artifactTreeObj)) {
        if(!$.isEmptyObject(parsedArtifactTree.experimentalBranches)) {
            parsedArtifactTree.experimentalTags = addTag(parsedArtifactTree.experimentalTags, artifactTreeObj)
        } else if( !$.isEmptyObject(parsedArtifactTree.releaseBranches) ) {
            parsedArtifactTree.releaseTags = addTag(parsedArtifactTree.releaseTags, artifactTreeObj)
        } else if (isReleaseBranch(parentObj)) {
            parsedArtifactTree.releaseRevisions = addTag(parsedArtifactTree.releaseRevisions, artifactTreeObj)
        } else if ( !isMainlineBranch(parentObj) && !isZeroTag(parentObj) ) {
            parsedArtifactTree.experimentalTags = addTag(parsedArtifactTree.experimentalTags, artifactTreeObj)
        } else {
            parsedArtifactTree.mainlineTags = addTag(parsedArtifactTree.mainlineTags, artifactTreeObj)
        }
    } else if (isMainlineOrExperimentalBranch(artifactTreeObj)) {
        if ( !isMainlineBranch(parentObj) && !isZeroTag(parentObj) ) {
            parsedArtifactTree.experimentalBranches = addTag(parsedArtifactTree.experimentalBranches, artifactTreeObj)
        } else {
            parsedArtifactTree.mainlineBranch = artifactTreeObj
        }
    } else if (isReleaseTag(artifactTreeObj)) {
        parsedArtifactTree.releaseTags = addTag(parsedArtifactTree.releaseTags, artifactTreeObj)
    } else if (isReleaseBranch(artifactTreeObj)) {
        parsedArtifactTree.releaseBranches = addTag(parsedArtifactTree.releaseBranches, artifactTreeObj)
    }
    
    return parsedArtifactTree
}

// function parseArtifactTreeObj ( obj, c ) {
    // return obj;
// }

function parseArtifactTreeArr ( arr, parentObj ) {
    if($.isArray(arr) && !$.isEmptyObject(arr) ) {
        return arr.map(function(tree, i ) {
            return parseArtifactTree(tree, parentObj)
        }).reduce(function(parsedTree1, parsedTree2, index, array) {
            if(parsedTree1 != parsedTree2)
                return combineParsedTrees(parsedTree1, parsedTree2)
            else 
                return parsedTree1
        });
    } else {
        return {
            zeroTagVersion : '',
            mainlineBranch : {},
            mainlineTags : [],
            experimentalBranches : [],
            experimentalTags : [],
            releaseBranches : [],
            releaseTags : [],
            releaseRevisions : []
        }
    }
}

function generateDataFromArtifactTree ( artifactTree, p ) {
    
    var parsedArtifactTree = parseArtifactTree(artifactTree, {})
    if(window.debug) {
        console.log('parsedArtifactTree:')
        console.log(parsedArtifactTree)
    }
    
    var sortByTimestamp = function (a, b) { return parseInt(a.timestamp) - parseInt(b.timestamp) }
    
    var zeroTagVersion = parsedArtifactTree.zeroTagVersion
    if(window.debug) {
        console.log('zeroTagVersion:')
        console.log(zeroTagVersion)
    }
    
    var mainlineBranch = parsedArtifactTree.mainlineBranch
    
    if(window.debug) {
        console.log('mainlineBranch:')
        console.log(mainlineBranch)
    }
    
    var allTags = []
        .concat(parsedArtifactTree.mainlineTags)
        .concat(parsedArtifactTree.experimentalTags)
        .concat(parsedArtifactTree.releaseTags)
        .concat(parsedArtifactTree.releaseRevisions)
        .sort( sortByTimestamp )
        .filter(function(tag) { return !isReleaseTag(tag)})
        .map( function( tag, i ) { tag.sequence = i + 1; return tag } )
        
    var findSequenceByVersion = function(version, allTags) {
        var tag = allTags.filter( function(tag) { 
            return tag.version == version
        } )
        if(!$.isEmptyObject(tag)) {
            return tag[0].sequence
        }
        return 0;
    }
    
    var extractVersionNumber = function(version) {
        var versionNumber = version
        if(version.indexOf('/') != -1) {
            versionSplitArr = version.split('/')
            versionNumber = versionSplitArr[1]
        }
        return versionNumber
    }
    var extractMaturityLevel = function(version) {
        var maturityLevel = ""
        if(version.indexOf('/') != -1) {
            versionSplitArr = version.split('/')
            maturityLevel = versionSplitArr[0].toUpperCase()
            if (maturityLevel == 'RELEASECANDIDATE') 
                maturityLevel = 'RC'
        }
        return maturityLevel
    }
    
    var experimentalBranches = parsedArtifactTree.experimentalBranches
        .sort( sortByTimestamp )
        .map(function(a, i ) {
                return {
                    version: extractVersionNumber(a.version), 
                    sequence: findSequenceByVersion(a.parentObj.version, allTags), 
                    name: a.name
                } 
            })
    if(window.debug) {
        console.log('experimentalBranches:')
        console.log(experimentalBranches)
    }
    var releaseBranches = parsedArtifactTree.releaseBranches
        .sort( sortByTimestamp )
        .map(function(a, i ) {
                return {
                    version: extractVersionNumber(a.version), 
                    sequence: findSequenceByVersion(a.parentObj.version, allTags), 
                    name: a.name
                } 
            })
    if(window.debug) {
        console.log('releaseBranches:')
        console.log(releaseBranches)
    }

    // zeroTagVersion = "0.x.x"

    // mainlineBranch = {version: "x.x", name: "trunk"}
    
    // experimentalBranches = [
        // {version: "x.x", sequence: 3, name: "branch1"},
        // {version: "x.x", sequence: 10, name: "branch2"}
    // ]
    // releaseBranches = [
        // {version: "1.x", sequence: 5, name: "release1"},
        // {version: "2.x", sequence: 7, name: "release2"}
    // ]

    p.releaseBranches = releaseBranches
    p.experimentalBranches = experimentalBranches
    p.numberOfReleaseBranches = ( releaseBranches.length )
    p.numberOfExperimentalBranches = ( experimentalBranches.length )
        
    var c = getLevelsConfiguration(p)
    if(window.debug) {
        console.log('levelsConfiguration:')
        console.log(c)
    }

    // mainlineTags = [
        // {version: "x.1", sequence: 1, from: c.MAINLINE_LEVEL, to: c.MAINLINE_DEV_LEVEL},
        // {version: "x.2", sequence: 2, from: c.MAINLINE_LEVEL, to: c.MAINLINE_TEST_LEVEL},
        // {version: "x.8", sequence: 8, from: c.MAINLINE_LEVEL, to: c.MAINLINE_USER_LEVEL},
    // ]

    // experimentalTags = [
        // {version: "x.3", sequence: 3, from: c.MAINLINE_LEVEL, to: c.EXPERIMENTAL_TAG_LEVEL},
        // {version: "x.9", sequence: 9, from: c.MAINLINE_LEVEL, to: c.EXPERIMENTAL_TAG_LEVEL},
        // {version: "x.4", sequence: 4, from: c.EXPERIMENTAL_BRANCH_LEVELS[dec(1)], to: c.EXPERIMENTAL_BRANCH_TEST_LEVELS[dec(1)]},
        // {version: "x.6", sequence: 6, from: c.EXPERIMENTAL_BRANCH_LEVELS[dec(1)], to: c.EXPERIMENTAL_BRANCH_USER_LEVELS[dec(1)]},
        // {version: "x.10", sequence: 10, from: c.EXPERIMENTAL_BRANCH_LEVELS[dec(2)], to: c.EXPERIMENTAL_BRANCH_TEST_LEVELS[dec(2)]},
        // {version: "x.11", sequence: 11, from: c.EXPERIMENTAL_BRANCH_LEVELS[dec(2)], to: c.EXPERIMENTAL_BRANCH_DEV_LEVELS[dec(2)]},
        // {version: "x.12", sequence: 12, from: c.EXPERIMENTAL_BRANCH_LEVELS[dec(2)], to: c.EXPERIMENTAL_BRANCH_TEST_LEVELS[dec(2)]},
        // {version: "x.13", sequence: 13, from: c.EXPERIMENTAL_BRANCH_LEVELS[dec(2)], to: c.EXPERIMENTAL_BRANCH_USER_LEVELS[dec(2)]},
        // {version: "x.14", sequence: 14, from: c.EXPERIMENTAL_BRANCH_LEVELS[dec(2)], to: c.EXPERIMENTAL_BRANCH_USER_LEVELS[dec(2)]},
    // ]
    // releaseTags = [
        // {version: "x.5", sequence: 5, from: c.MAINLINE_LEVEL, to: c.RELEASE_TAG_LEVEL},
        // {version: "x.7", sequence: 7, from: c.MAINLINE_LEVEL, to: c.RELEASE_TAG_LEVEL},
        // {version: "2.0", sequence: 8, from: c.RELEASE_BRANCH_LEVELS[dec(2)], to: c.RELEASE_BRANCH_USER_LEVELS[dec(2)]},
        // {version: "1.0", sequence: 9, from: c.RELEASE_BRANCH_LEVELS[dec(1)], to: c.RELEASE_BRANCH_TEST_LEVELS[dec(1)]},
        // {version: "1.1", sequence: 10, from: c.RELEASE_BRANCH_LEVELS[dec(1)], to: c.RELEASE_BRANCH_USER_LEVELS[dec(1)]},
        // {version: "1.2", sequence: 11, from: c.RELEASE_BRANCH_LEVELS[dec(1)], to: c.RELEASE_BRANCH_RC_LEVELS[dec(1)]},
        // {version: "1.3", sequence: 12, from: c.RELEASE_BRANCH_LEVELS[dec(1)], to: c.RELEASE_BRANCH_PROD_LEVELS[dec(1)]},
        // {version: "2.1", sequence: 13, from: c.RELEASE_BRANCH_LEVELS[dec(2)], to: c.RELEASE_BRANCH_RC_LEVELS[dec(2)]},
    // ]

    var getExperimentalTagFromLevel = function(artifact, c) {
        var experimentalBranchIndex = 0;
        if(isMainlineBranch(artifact.parentObj)) {
            return c.MAINLINE_LEVEL
        } else if (isMainlineOrExperimentalBranch(artifact.parentObj)) {
            experimentalBranches.forEach(function(experimentalBranch, i) {
                if(experimentalBranch.version == artifact.parentObj.version && experimentalBranch.name == artifact.parentObj.name) {
                    experimentalBranchIndex = i; return;
                }
            })
            return c.EXPERIMENTAL_BRANCH_LEVELS[experimentalBranchIndex]
        }
    }
    var getExperimentalTagToLevel = function(artifact, c) {
        var experimentalBranchIndex = 0;
        var maturityLevel = ""
        var toLevel = 0
        if(isMainlineBranch(artifact.parentObj)) {
            return c.EXPERIMENTAL_TAG_LEVEL
        } else if (isMainlineOrExperimentalBranch(artifact.parentObj)) {
            experimentalBranches.forEach(function(experimentalBranch, i) {
                if(experimentalBranch.version == artifact.parentObj.version && experimentalBranch.name == artifact.parentObj.name) {
                    experimentalBranchIndex = i; return;
                }
            })
            maturityLevel = extractMaturityLevel(artifact.version)
            switch(maturityLevel) {
                case "DEV": toLevel = c.EXPERIMENTAL_BRANCH_DEV_LEVELS[experimentalBranchIndex]; break;
                case "TEST": toLevel = c.EXPERIMENTAL_BRANCH_TEST_LEVELS[experimentalBranchIndex]; break;
                case "USER": toLevel = c.EXPERIMENTAL_BRANCH_USER_LEVELS[experimentalBranchIndex]; break;
                default: toLevel = c.EXPERIMENTAL_BRANCH_DEV_LEVELS[experimentalBranchIndex]; break;
            }
            return toLevel
        }
    }
    var getReleaseTagFromLevel = function(artifact, c) {
        var releaseBranchIndex = 0;
        if(isMainlineBranch(artifact.parentObj)) {
            return c.MAINLINE_LEVEL
        } else if (isReleaseBranch(artifact.parentObj)) {
            releaseBranches.forEach(function(releaseBranch, i) {
                if(releaseBranch.version == artifact.parentObj.version && releaseBranch.name == artifact.parentObj.name) {
                    releaseBranchIndex = i; return;
                }
            })
            return c.RELEASE_BRANCH_LEVELS[releaseBranchIndex]
        } else if (isMainlineOrExperimentalTagOrReleaseRevision(artifact.parentObj)) {
            return c.RELEASE_REVISION_LEVELS[releaseBranchIndex]
        }
    }
    var getReleaseTagToLevel = function(artifact, c) {
        var releaseBranchIndex = 0;
        var maturityLevel = ""
        var toLevel = 0
        if(isMainlineBranch(artifact.parentObj)) {
            return c.RELEASE_TAG_LEVEL
        } else if (isReleaseBranch(artifact.parentObj) || isMainlineOrExperimentalTagOrReleaseRevision(artifact.parentObj)) {
            releaseBranches.forEach(function(releaseBranch, i) {
                if(releaseBranch.version == artifact.parentObj.version && releaseBranch.name == artifact.parentObj.name) {
                    releaseBranchIndex = i; return;
                }
            })
            maturityLevel = extractMaturityLevel(artifact.version)
            switch(maturityLevel) {
                case "TEST": toLevel = c.RELEASE_BRANCH_TEST_LEVELS[releaseBranchIndex]; break;
                case "USER": toLevel = c.RELEASE_BRANCH_USER_LEVELS[releaseBranchIndex]; break;
                case "RC"  : toLevel = c.RELEASE_BRANCH_RC_LEVELS[releaseBranchIndex];   break;
                case "PROD": toLevel = c.RELEASE_BRANCH_PROD_LEVELS[releaseBranchIndex]; break;
                default    : toLevel = c.RELEASE_BRANCH_TEST_LEVELS[releaseBranchIndex];      break;
            }
            return toLevel
        }
    }
    
    var getReleaseRevisionFromLevel = function(artifact, c) {
        var releaseBranchIndex = 0 
        if (isReleaseBranch(artifact.parentObj)) {
            releaseBranches.forEach(function(releaseBranch, i) {
                if(releaseBranch.version == artifact.parentObj.version && releaseBranch.name == artifact.parentObj.name) {
                    releaseBranchIndex = i; return;
                }
            })
            return c.RELEASE_BRANCH_LEVELS[releaseBranchIndex]
        }
    }
    var getReleaseRevisionToLevel = function(artifact, c) {
        var releaseBranchIndex = 0 
        return c.RELEASE_REVISION_LEVELS[releaseBranchIndex]
    }

    var mainlineTags = parsedArtifactTree.mainlineTags
        .sort( sortByTimestamp )
        .map ( function(a) { 
            return {
                version: extractVersionNumber(a.version), 
                sequence: findSequenceByVersion(a.version, allTags), 
                from: c.MAINLINE_LEVEL, 
                to: (function(artifact) {
                    var toLevel = 0
                    switch(extractMaturityLevel(artifact.version)) {
                        case "DEV": toLevel = c.MAINLINE_DEV_LEVEL; break;
                        case "TEST": toLevel = c.MAINLINE_TEST_LEVEL; break;
                        case "USER": toLevel = c.MAINLINE_USER_LEVEL; break;
                        default: toLevel = c.MAINLINE_DEV_LEVEL; break;
                    }
                    return toLevel;
                }) (a),
                maturityLevel: extractMaturityLevel(a.version)
            } 
        })
                
    if(window.debug) {
        console.log('mainlineTags:')
        console.log(mainlineTags)
    }
    
    var experimentalTags = parsedArtifactTree.experimentalTags
        .sort( sortByTimestamp )
        .map ( function(a) { 
            return {
                version: extractVersionNumber(a.version), 
                sequence: findSequenceByVersion(a.version, allTags), 
                from: getExperimentalTagFromLevel(a, c), 
                to: getExperimentalTagToLevel(a, c),
                maturityLevel: extractMaturityLevel(a.version)
            } 
        })
    if(window.debug) {
        console.log('experimentalTags:')
        console.log(experimentalTags)
    }
    
    var releaseTags = parsedArtifactTree.releaseTags
        .sort( sortByTimestamp )
        .map ( function(a) { 
            return {
                version: extractVersionNumber(a.version), 
                sequence: function() {
                    if(isMainlineOrExperimentalTagOrReleaseRevision(a)) {
                        return findSequenceByVersion(a.version, allTags)
                    } else {
                        return a.parentObj.sequence
                    }
                }(), 
                from: getReleaseTagFromLevel(a, c), 
                to: getReleaseTagToLevel(a, c),
                maturityLevel: extractMaturityLevel(a.version)
            } 
        })
    if(window.debug) {
        console.log('releaseTags:')
        console.log(releaseTags)
    }

    var releaseRevisions = parsedArtifactTree.releaseRevisions
        .sort( sortByTimestamp )
        .map ( function(a) { 
            return {
                version: extractVersionNumber(a.version), 
                sequence: findSequenceByVersion(a.version, allTags), 
                from: getReleaseRevisionFromLevel(a, c), 
                to: getReleaseRevisionToLevel(a, c),
                maturityLevel: extractMaturityLevel(a.version)
            } 
        })
    if(window.debug) {
        console.log('releaseRevisions:')
        console.log(releaseRevisions)
    }

    var data = {}
    data.zeroTagVersion = zeroTagVersion
    data.mainlineBranch = mainlineBranch
    data.experimentalBranchesList = experimentalBranches
    data.releaseBranchesList = releaseBranches
    data.mainlineTags = mainlineTags
    data.experimentalTags = experimentalTags
    data.releaseTags = releaseTags
    data.releaseRevisions = releaseRevisions
    
    return data;
}
function generateVisualizationData(p) {
    
    if(!p) {
        var p = {
            snapshotOnSeparateLevel:        false,
            maturityLevels:                 false,
            zeroTag:                        false,
            zeroTagVersion:                 "0.x.x",
            mainlineBranch:                 {version: "x.x", name : ""},
            mainlineTags:                   [],
            experimentalBranches:           [],
            releaseBranches:                [],
            xRightMargin:                   0,
            xLeftMargin:                    0,
            tagTextMargin:                  0,
            tagsDistance:                   0,
            levelHeight:                    0,
            yTopMargin:                     0,
            width:                          0,
        }
    }
    var displayExperimentalBranches = (p.experimentalBranches.length > 0)
    var displayReleaseBranches = (p.releaseBranches.length > 0)
    var numberOfExperimentalBranches = (p.experimentalBranches.length )
    var numberOfReleaseBranches = (p.releaseBranches.length )
    p.numberOfExperimentalBranches = numberOfExperimentalBranches
    p.numberOfReleaseBranches = numberOfReleaseBranches
    
    var c = getLevelsConfiguration(p)
    
    var snapshotOnSeparateLevel = p.snapshotOnSeparateLevel
    var maturityLevels = p.maturityLevels
    var zeroTag = p.zeroTag
    var xRightMargin = p.xRightMargin
    var xLeftMargin = p.xLeftMargin
    var tagTextMargin = p.tagTextMargin
    var tagsDistance = p.tagsDistance
    var levelHeight = p.levelHeight
    var yTopMargin = p.yTopMargin
    var width = p.width
    var zeroTagVersion = p.zeroTagVersion
    var mainlineBranch = p.mainlineBranch
    var mainlineTags = p.mainlineTags
    var experimentalBranches = p.experimentalBranches
    var releaseBranches = p.releaseBranches
    var experimentalTags = p.experimentalTags
    var releaseTags = p.releaseTags
    var releaseRevisions = p.releaseRevisions

    var branchConnectors = [], branchConnectorNodes = []
    var tagConnectors = [], tagConnectorNodes = []
    var branchArrows = [], branchArrowNodes = []

    var maturityLevelsList = [
        {'name': 'DEV', 'level': c.MAINLINE_DEV_LEVEL, color: '#edf8e9', class: 'mainlineMaturityLevel'}, 
        {'name': 'TEST', 'level': c.MAINLINE_TEST_LEVEL, color: '#bae4b3', class: 'mainlineMaturityLevel'},
        {'name': 'USER', 'level': c.MAINLINE_USER_LEVEL, color: '#74c476', class: 'mainlineMaturityLevel'},
    ]
    if(displayReleaseBranches && numberOfReleaseBranches > 0) {        
        maturityLevelsList = maturityLevelsList.concat([
            {'name': 'TEST', 'level': c.RELEASE_BRANCH_TEST_LEVELS[dec(1)], color: '#bae4b3', class: 'releaseMaturityLevel'},
            {'name': 'USER', 'level': c.RELEASE_BRANCH_USER_LEVELS[dec(1)], color: '#74c476', class: 'releaseMaturityLevel'}, 
            {'name': 'RC', 'level': c.RELEASE_BRANCH_RC_LEVELS[dec(1)], color: '#31a354', class: 'releaseMaturityLevel'}, 
            {'name': 'PROD', 'level': c.RELEASE_BRANCH_PROD_LEVELS[dec(1)], color: '#006d2c', class: 'releaseMaturityLevel'} 
        ])
    }
    if(window.debug) {
        console.log('maturityLevelsList:')
        console.log(maturityLevelsList)
    }
    var tagConnectorNodesMapping = function(tag, i ) {
        return [
            {
                x:xLeftMargin + tagsDistance*tag.sequence, 
                y:levelHeight*tag.from + yTopMargin 
            }, 
            {
                x:xLeftMargin + tagsDistance*tag.sequence, 
                y:levelHeight*tag.to + yTopMargin
            }
        ]
    }
    
    if(displayExperimentalBranches) {
        tagConnectors = tagConnectors.concat(experimentalTags.map(function(tag, i) {
            return {
                s:firstCol(i, tagConnectorNodes.length), 
                t:secondCol(i, tagConnectorNodes.length), 
                version: tag.version,    
                class: 'experimentalTag'
            }
        }))
        
        tagConnectorNodes = tagConnectorNodes.concat([].concat.apply([], experimentalTags.map(tagConnectorNodesMapping)))
        
        branchArrows = branchArrows.concat(experimentalBranches.map(function(branch, i) {
            return {
                s:firstCol(i, branchArrowNodes.length), 
                t:secondCol(i, branchArrowNodes.length), 
                version: branch.version, 
                branchName: branch.name, 
                class: 'experimentalBranch'
            }
        }))
        
        branchArrowNodes = branchArrowNodes.concat([].concat.apply([],experimentalBranches.map(function(branch, i) {
            return [
                {
                    x:xLeftMargin + tagsDistance*branch.sequence, 
                    y:levelHeight*c.EXPERIMENTAL_BRANCH_LEVELS[i] + yTopMargin
                }, 
                {
                    x:width - xRightMargin, 
                    y:levelHeight*c.EXPERIMENTAL_BRANCH_LEVELS[i] + yTopMargin
                },
            ]
        })))
        
        branchConnectors = branchConnectors.concat(experimentalBranches.map(function(branch, i) {
            return {
                s:firstCol(i, branchConnectorNodes.length),
                t:secondCol(i, branchConnectorNodes.length), 
                class: 'experimentalBranch'
            }
        }))
        
        branchConnectorNodes = branchConnectorNodes.concat([].concat.apply([],experimentalBranches.map(function(branch, i) {
            return [
                {
                    x:xLeftMargin + tagsDistance*branch.sequence, 
                    y:levelHeight*c.EXPERIMENTAL_TAG_LEVEL + yTopMargin + tagTextMargin
                }, 
                {
                    x:xLeftMargin + tagsDistance*branch.sequence, 
                    y:levelHeight*c.EXPERIMENTAL_BRANCH_LEVELS[i] + yTopMargin
                },
            ]
        })))
    }
    if(zeroTag) {
        tagConnectors = tagConnectors.concat([
            {s:firstCol(0, tagConnectorNodes.length), t:secondCol(0, tagConnectorNodes.length), version: zeroTagVersion,  class: 'zeroTag'},
        ])
        tagConnectorNodes = tagConnectorNodes.concat([
            {x:xLeftMargin + tagsDistance*0, y:levelHeight*c.ZERO_TAG_LEVEL + yTopMargin }, {x:xLeftMargin + tagsDistance*0, y:levelHeight*c.ZERO_TAG_LEVEL + yTopMargin },
        ])
        branchConnectors = branchConnectors.concat([
            {s:firstCol(0, branchConnectorNodes.length), t:secondCol(0, branchConnectorNodes.length), class: 'mainline'},
        ])
        branchConnectorNodes = branchConnectorNodes.concat([
            {x:xLeftMargin + tagsDistance*0, y:levelHeight*c.ZERO_TAG_LEVEL + yTopMargin }, {x:xLeftMargin + tagsDistance*0, y:levelHeight*c.MAINLINE_LEVEL + yTopMargin},
        ])
    }
    tagConnectors = tagConnectors.concat(mainlineTags.map(function(tag, i) {
            return {
                s:firstCol(i, tagConnectorNodes.length), 
                t:secondCol(i, tagConnectorNodes.length), 
                version: tag.version,
                class: 'mainlineTag'
            }
        }))
    tagConnectorNodes = tagConnectorNodes.concat([].concat.apply([], mainlineTags.map(tagConnectorNodesMapping)))
   
    branchArrows = branchArrows.concat([ 
        {
            s:firstCol(0, branchArrowNodes.length), 
            t:secondCol(0, branchArrowNodes.length), 
            version:mainlineBranch.version, 
            branchName: mainlineBranch.name, 
            class: 'mainline'
        }, 
    ])
    branchArrowNodes = branchArrowNodes.concat([ 
        {
            x:xLeftMargin + tagsDistance*0, 
            y:levelHeight*c.MAINLINE_LEVEL + yTopMargin
        }, 
        {
            x:width - xRightMargin, 
            y:levelHeight*c.MAINLINE_LEVEL + yTopMargin
        },
    ])

    
    if(displayReleaseBranches) {        
        tagConnectors = tagConnectors.concat(releaseTags.map(function(tag, i) {
            return {
                s:firstCol(i, tagConnectorNodes.length), 
                t:secondCol(i, tagConnectorNodes.length), 
                version: tag.version,
                class: 'releaseTag'
            }
        }))
        tagConnectorNodes = tagConnectorNodes.concat([].concat.apply([], releaseTags.map(tagConnectorNodesMapping)))
        
        tagConnectors = tagConnectors.concat(releaseRevisions.map(function(tag, i) {
            return {
                s:firstCol(i, tagConnectorNodes.length), 
                t:secondCol(i, tagConnectorNodes.length), 
                version: tag.version,
                class: 'releaseRevision'
            }
        }))
        tagConnectorNodes = tagConnectorNodes.concat([].concat.apply([], releaseRevisions.map(tagConnectorNodesMapping)))
        
        branchArrows = branchArrows.concat(releaseBranches.map(function(branch, i) {
            return {
                s:firstCol(i, branchArrowNodes.length), 
                t:secondCol(i, branchArrowNodes.length), 
                version: branch.version, 
                branchName: branch.name, 
                class: 'releaseBranch'
            }
        }))
        
        branchArrowNodes = branchArrowNodes.concat([].concat.apply([],releaseBranches.map(function(branch, i) {
            return [
                {
                    x:xLeftMargin + tagsDistance*branch.sequence, 
                    y:levelHeight*c.RELEASE_BRANCH_LEVELS[i] + yTopMargin
                }, 
                {
                    x:width - xRightMargin, 
                    y:levelHeight*c.RELEASE_BRANCH_LEVELS[i] + yTopMargin
                },
            ]
        })))
        
        branchConnectors = branchConnectors.concat(releaseBranches.map(function(branch, i) {
            return {
                s:firstCol(i, branchConnectorNodes.length),
                t:secondCol(i, branchConnectorNodes.length), 
                class: 'releaseBranch'
            }
        }))
        
        branchConnectorNodes = branchConnectorNodes.concat([].concat.apply([],releaseBranches.map(function(branch, i) {
            return [
                {
                    x:xLeftMargin + tagsDistance*branch.sequence, 
                    y:levelHeight*c.RELEASE_TAG_LEVEL + yTopMargin + tagTextMargin
                }, 
                {
                    x:xLeftMargin + tagsDistance*branch.sequence, 
                    y:levelHeight*c.RELEASE_BRANCH_LEVELS[i] + yTopMargin
                },
            ]
        })))
    }
    
    var resultObj = {
        'branchConnectors'        :   branchConnectors,   
        'branchConnectorNodes'    :   branchConnectorNodes,
        'tagConnectors'           :   tagConnectors,      
        'tagConnectorNodes'       :   tagConnectorNodes,
        'branchArrows'            :   branchArrows,       
        'branchArrowNodes'        :   branchArrowNodes,   
        'maturityLevelsList'      :   maturityLevelsList   
    }
    return resultObj
}

function getLevelsConfiguration(paramsObj) {
    if(!paramsObj) {
        var paramsObj = {
            snapshotOnSeparateLevel:        false,
            maturityLevels:                 false,
            displayExperimentalBranches:    false,
            numberOfExperimentalBranches:   0,
            displayReleaseBranches:         false,
            numberOfReleaseBranches:        0,
        }
    }
    var resultObj = {
        ZERO_TAG_LEVEL:                 0,
        MAINLINE_LEVEL:                 0,
        MAINLINE_DEV_LEVEL:             0,
        MAINLINE_TEST_LEVEL:            0,
        MAINLINE_USER_LEVEL:            0,
        EXPERIMENTAL_TAG_LEVEL:         0,
        EXPERIMENTAL_BRANCH_LEVELS:     [],
        EXPERIMENTAL_BRANCH_DEV_LEVELS: [],
        EXPERIMENTAL_BRANCH_TEST_LEVELS:[],
        EXPERIMENTAL_BRANCH_USER_LEVELS:[],
        RELEASE_TAG_LEVEL:              0,
        RELEASE_REVISION_LEVELS:        [],
        RELEASE_BRANCH_LEVELS:          [],
        RELEASE_BRANCH_TEST_LEVELS:     [],
        RELEASE_BRANCH_USER_LEVELS:     [],
        RELEASE_BRANCH_RC_LEVELS:       [],
        RELEASE_BRANCH_PROD_LEVELS:     [],
    }
    
    var levelsCounter = 0;
    var numberOfExperimentalBranches = paramsObj.numberOfExperimentalBranches;
    var numberOfReleaseBranches = paramsObj.numberOfReleaseBranches;
    var displayExperimentalBranches = paramsObj.displayExperimentalBranches;
    var displayReleaseBranches = paramsObj.displayReleaseBranches;
    
    var getExperimentalLevel = function(maturity, experimentalBranchLevelOffset, paramsObj) {
        var numberOfExperimentalBranches = paramsObj.numberOfExperimentalBranches
        var maturityLevels = paramsObj.maturityLevels
        var displayReleaseBranches = paramsObj.displayReleaseBranches
        var mainlineMaturityLevelOffset = 0;
        var mainlineLevel = 1;
        var experimentalTagLevel = 1;
        if(maturityLevels) {
            switch (maturity) {
                case 'DEV': mainlineMaturityLevelOffset = 1; break
                case 'TEST': mainlineMaturityLevelOffset = 2; break
                case 'USER': mainlineMaturityLevelOffset = 3; break
            }
        } 
        var experimentalLevel = numberOfExperimentalBranches + experimentalTagLevel + mainlineLevel - experimentalBranchLevelOffset + mainlineMaturityLevelOffset
        if(displayReleaseBranches || !maturityLevels) 
            experimentalLevel++;
        return experimentalLevel
    }
    
    if(!paramsObj.snapshotOnSeparateLevel && !paramsObj.maturityLevels) {
        if(displayExperimentalBranches) {
            while (paramsObj.numberOfExperimentalBranches-- > 0) {
                levelsCounter++;
                resultObj.EXPERIMENTAL_BRANCH_LEVELS.push(levelsCounter)
                resultObj.EXPERIMENTAL_BRANCH_DEV_LEVELS.push(levelsCounter)
                resultObj.EXPERIMENTAL_BRANCH_TEST_LEVELS.push(levelsCounter)
                resultObj.EXPERIMENTAL_BRANCH_USER_LEVELS.push(levelsCounter)
            }
        }
        resultObj.ZERO_TAG_LEVEL = ++levelsCounter;
        if(displayExperimentalBranches) 
            resultObj.EXPERIMENTAL_TAG_LEVEL = ++levelsCounter;
        resultObj.MAINLINE_LEVEL = levelsCounter;
        if(displayReleaseBranches)
            resultObj.RELEASE_TAG_LEVEL = levelsCounter;
        resultObj.MAINLINE_DEV_LEVEL = levelsCounter;
        resultObj.MAINLINE_TEST_LEVEL = levelsCounter;
        resultObj.MAINLINE_USER_LEVEL = levelsCounter;
        if(displayReleaseBranches) {
            while (paramsObj.numberOfReleaseBranches-- > 0) {
                if(displayReleaseBranches)
                    resultObj.RELEASE_REVISION_LEVELS.push(levelsCounter)
                levelsCounter++;
                resultObj.RELEASE_BRANCH_LEVELS.push(levelsCounter)
                resultObj.RELEASE_BRANCH_TEST_LEVELS.push(levelsCounter)
                resultObj.RELEASE_BRANCH_USER_LEVELS.push(levelsCounter)
                resultObj.RELEASE_BRANCH_RC_LEVELS.push(levelsCounter)
                resultObj.RELEASE_BRANCH_PROD_LEVELS.push(levelsCounter)
            }
        }
    } else if(!paramsObj.maturityLevels) {
        var numberOfExperimentalBranches = paramsObj.numberOfExperimentalBranches;
        if(displayExperimentalBranches) {
            while (paramsObj.numberOfExperimentalBranches-- > 0) {
                levelsCounter++;
                resultObj.EXPERIMENTAL_BRANCH_LEVELS.push(levelsCounter)
                resultObj.EXPERIMENTAL_BRANCH_DEV_LEVELS.push(numberOfExperimentalBranches + getExperimentalLevel('DEV', (paramsObj.numberOfExperimentalBranches) ,paramsObj))
                resultObj.EXPERIMENTAL_BRANCH_TEST_LEVELS.push(numberOfExperimentalBranches + getExperimentalLevel('TEST', (paramsObj.numberOfExperimentalBranches),paramsObj))
                resultObj.EXPERIMENTAL_BRANCH_USER_LEVELS.push(numberOfExperimentalBranches + getExperimentalLevel('USER', (paramsObj.numberOfExperimentalBranches), paramsObj))
            }
        }
        resultObj.ZERO_TAG_LEVEL = ++levelsCounter;
        if(displayExperimentalBranches)
            resultObj.EXPERIMENTAL_TAG_LEVEL = levelsCounter;
        resultObj.MAINLINE_LEVEL = ++levelsCounter;
        if(displayReleaseBranches) {
            resultObj.RELEASE_TAG_LEVEL = ++levelsCounter;
        } else {
            ++levelsCounter;
        }
        resultObj.MAINLINE_DEV_LEVEL = levelsCounter;
        resultObj.MAINLINE_TEST_LEVEL = levelsCounter;
        resultObj.MAINLINE_USER_LEVEL = levelsCounter;
        var numberOfReleaseBranches = paramsObj.numberOfReleaseBranches;
        if(displayReleaseBranches) {
            while (paramsObj.numberOfReleaseBranches-- > 0) {
                resultObj.RELEASE_BRANCH_LEVELS.push(++levelsCounter)
            }
        }
        paramsObj.numberOfReleaseBranches = numberOfReleaseBranches ;
        resultObj.RELEASE_REVISION_LEVELS.push(++levelsCounter)
        ++levelsCounter
        if(displayReleaseBranches) {
            while (paramsObj.numberOfReleaseBranches-- > 0) {
                resultObj.RELEASE_BRANCH_TEST_LEVELS.push(levelsCounter)
                resultObj.RELEASE_BRANCH_USER_LEVELS.push(levelsCounter)
                resultObj.RELEASE_BRANCH_RC_LEVELS.push(levelsCounter)
                resultObj.RELEASE_BRANCH_PROD_LEVELS.push(levelsCounter)
            }
        }
    } else {
        var numberOfExperimentalBranches = paramsObj.numberOfExperimentalBranches;
        if(displayExperimentalBranches) {
            while (paramsObj.numberOfExperimentalBranches-- > 0) {
                levelsCounter++;
                resultObj.EXPERIMENTAL_BRANCH_LEVELS.push(levelsCounter)
                resultObj.EXPERIMENTAL_BRANCH_DEV_LEVELS.push(numberOfExperimentalBranches + getExperimentalLevel('DEV', (paramsObj.numberOfExperimentalBranches ),paramsObj))
                resultObj.EXPERIMENTAL_BRANCH_TEST_LEVELS.push(numberOfExperimentalBranches + getExperimentalLevel('TEST', (paramsObj.numberOfExperimentalBranches),paramsObj))
                resultObj.EXPERIMENTAL_BRANCH_USER_LEVELS.push(numberOfExperimentalBranches + getExperimentalLevel('USER', (paramsObj.numberOfExperimentalBranches), paramsObj))
            }
        }
        resultObj.ZERO_TAG_LEVEL = ++levelsCounter;
        if(displayExperimentalBranches) 
            resultObj.EXPERIMENTAL_TAG_LEVEL = levelsCounter;
        resultObj.MAINLINE_LEVEL = ++levelsCounter;
        if(displayReleaseBranches)
            resultObj.RELEASE_TAG_LEVEL = ++levelsCounter;
        resultObj.MAINLINE_DEV_LEVEL = ++levelsCounter;
        resultObj.MAINLINE_TEST_LEVEL = ++levelsCounter;
        resultObj.MAINLINE_USER_LEVEL = ++levelsCounter;
        var numberOfReleaseBranches = paramsObj.numberOfReleaseBranches;
        if(displayReleaseBranches) {
            while (paramsObj.numberOfReleaseBranches-- > 0) {
                resultObj.RELEASE_BRANCH_LEVELS.push(++levelsCounter)
            }
            paramsObj.numberOfReleaseBranches = numberOfReleaseBranches ;
            resultObj.RELEASE_REVISION_LEVELS.push(++levelsCounter)
            ++levelsCounter
            while (paramsObj.numberOfReleaseBranches-- > 0) {
                resultObj.RELEASE_BRANCH_TEST_LEVELS.push(levelsCounter)
            }
            paramsObj.numberOfReleaseBranches = numberOfReleaseBranches ;
            ++levelsCounter
            while (paramsObj.numberOfReleaseBranches-- > 0) {
                resultObj.RELEASE_BRANCH_USER_LEVELS.push(levelsCounter)
            }
            paramsObj.numberOfReleaseBranches = numberOfReleaseBranches ;
            ++levelsCounter
            while (paramsObj.numberOfReleaseBranches-- > 0) {
                resultObj.RELEASE_BRANCH_RC_LEVELS.push(levelsCounter)
            }
            paramsObj.numberOfReleaseBranches = numberOfReleaseBranches ;
            ++levelsCounter
            while (paramsObj.numberOfReleaseBranches-- > 0) {
                resultObj.RELEASE_BRANCH_PROD_LEVELS.push(levelsCounter)
            }
        }
    }
    return resultObj;
}


function streamlineGraph() {
    
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 960,
        height = 500,
        charge = -800,
        linkDistance = 150,
        circleRadius = 20,
        dataFile = "data/versions.json",
        parentDOMElement = 'body',
        snapshotOnSeparateLevel = true,
        tagsDistance = 40,
        levelHeight = 30,
        useShapes = true,
        nodeArrows = true,
        maturityLevels = true,
        displayExperimentalBranches = true,
        displayReleaseBranches = true,
        zeroTag = true,
        tagTextMargin = 10,
        arrowSize = 10;

    var dataProcessing = function(error, data) {
        var color = d3.scale.category20();

        var svg = d3.select('#streamlineGraph svg')
            .attr("width", width)
            .attr("height", height)
            .call(d3.behavior.zoom().scaleExtent([-8, 8]).on('zoom', function() {
                svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            }))
        
        svg.append("svg:defs").selectAll("marker")
            .data(["branchArrow"])
            .enter().append("svg:marker")
            .attr("id", String)
            .attr("class", 'branchArrow')
            .attr("viewBox", "0 -5 " + arrowSize + " " + arrowSize)
            .attr("refX", arrowSize/2)
            .attr("refY", 0)
            .attr("markerWidth", arrowSize)
            .attr("markerHeight", arrowSize)
            .attr("markerUnits", 'userSpaceOnUse')
            .attr("orient", "auto")
            .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5");
        svg.append("svg:defs").selectAll("marker")
            .data(["tagArrow"])
            .enter().append("svg:marker")
            .attr("id", String)
            .attr("class", 'tagArrow')
            .attr("viewBox", "0 -5 " + arrowSize + " " + arrowSize)
            .attr("refX", tagTextMargin + arrowSize)
            .attr("refY", 0)
            .attr("markerWidth", arrowSize)
            .attr("markerHeight", arrowSize)
            .attr("orient", "auto")
            .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5");
        svg.selectAll(".tagArrow")
            .data(["tagArrow"])
            .attr("refX", tagTextMargin + arrowSize)
        svg.selectAll(".tagArrow")
            .data(["tagArrow"])
            .transition().duration(1000).ease("quad")
            .attr("refX", tagTextMargin + arrowSize)
    
        var numberOfTags = 12;
        var tags = Array.apply(null, {length: numberOfTags}).map(Number.call, Number)
        var numberOfLevels = 5;
        var yTopMargin = tagTextMargin;
        var xLeftMargin = tagTextMargin;
        if(maturityLevels) {
            xLeftMargin += 50;
        }
        var xRightMargin = 100;
        
        var d = generateDataFromArtifactTree(data, {
            'displayExperimentalBranches':    displayExperimentalBranches,
            'displayReleaseBranches':         displayReleaseBranches,
            'snapshotOnSeparateLevel':      snapshotOnSeparateLevel,
            'maturityLevels':               maturityLevels,
        })
        var zeroTagVersion = d.zeroTagVersion
        var mainlineBranch = d.mainlineBranch
        var experimentalBranchesList = d.experimentalBranchesList
        var releaseBranchesList = d.releaseBranchesList
        var mainlineTags = d.mainlineTags
        var experimentalTags = d.experimentalTags
        var releaseTags = d.releaseTags
        var releaseRevisions = d.releaseRevisions
        
        var options = {
            'snapshotOnSeparateLevel':        snapshotOnSeparateLevel,
            'maturityLevels':                 maturityLevels,
            'numberOfExperimentalBranches':   experimentalBranchesList.length ,
            'numberOfReleaseBranches':        releaseBranchesList.length,
            'zeroTag' : zeroTag,
            'zeroTagVersion' : zeroTagVersion,
            'xRightMargin' : xRightMargin,
            'xLeftMargin' : xLeftMargin,
            'tagTextMargin' : tagTextMargin,
            'tagsDistance' : tagsDistance,
            'levelHeight' : levelHeight,
            'yTopMargin' : yTopMargin,
            'width' : width,
            'mainlineBranch' : mainlineBranch,
            'displayExperimentalBranches':    displayExperimentalBranches,
            'displayReleaseBranches':         displayReleaseBranches,
            'experimentalBranches':           experimentalBranchesList,
            'releaseBranches':                releaseBranchesList,
            'mainlineTags' :                  mainlineTags,
            'experimentalTags' :              experimentalTags,
            'releaseTags' :                   releaseTags,
            'releaseRevisions' :              releaseRevisions,
        }
        
        var data = generateVisualizationData(options)
        if(window.debug) {
            console.log("visualizationData:")
            console.log(data)
        }
        var branchConnectors = data.branchConnectors   
        var branchConnectorNodes = data.branchConnectorNodes
        var tagConnectors = data.tagConnectors      
        var tagConnectorNodes = data.tagConnectorNodes
        var branchArrows = data.branchArrows       
        var branchArrowNodes = data.branchArrowNodes   
        var maturityLevelsList = data.maturityLevelsList   
        
        if(!displayExperimentalBranches) {
//            svg.selectAll('.experimentalBranch').style('visibility', 'hidden')
//            svg.selectAll('.experimentalTag').style('visibility', 'hidden')
            $('.experimentalBranch').hide()
            $('.experimentalTag').hide()
        } else {
//            svg.selectAll('.experimentalBranch').style('visibility', 'visible')
//            svg.selectAll('.experimentalTag').style('visibility', 'visible')
            $('.experimentalBranch').delay(1000).show(0)
            $('.experimentalTag').delay(1000).show(0)
        }
        if(!displayReleaseBranches) {
//            svg.selectAll('.releaseBranch').style('visibility', 'hidden')
//            svg.selectAll('.releaseTag').style('visibility', 'hidden')
            $('.releaseBranch').hide()
            $('.releaseTag').hide()
            $('.releaseRevision').hide()
        } else {
//            svg.selectAll('.releaseBranch').style('visibility', 'visible')
//            svg.selectAll('.releaseTag').style('visibility', 'visible')
            $('.releaseBranch').delay(1000).show(0)
            $('.releaseTag').delay(1000).show(0)
            $('.releaseRevision').delay(1000).show(0)
        }
        if(!maturityLevels) {
            svg.selectAll('.maturityLevelLabel')
                .style('visibility', 'hidden')
            svg.selectAll('.maturityLevelShape')
                .style('visibility', 'hidden')
        } else {
            svg.selectAll('.maturityLevelLabel')
                .style('visibility', 'visible')
            svg.selectAll('.maturityLevelShape')
                .style('visibility', 'visible')
        
            if(!displayReleaseBranches) {
                svg.selectAll('.releaseMaturityLevel').style('visibility', 'hidden')
            } else {
                svg.selectAll('.releaseMaturityLevel').style('visibility', 'visible')
            }
            
            svg.selectAll('.maturityLevelShape').data(maturityLevelsList).enter()
                .append('rect')
                .attr("class", function(d) { return "maturityLevelShape " + d.class } )
                .attr("width", width - xLeftMargin - xRightMargin)
                .attr("height", levelHeight)
                .attr('x', xLeftMargin)
                .attr('y', function(d) {
                    return d.level*levelHeight - levelHeight*0.5 + yTopMargin ;
                })
                .style("stroke", 'none')
                .style("fill", function(d) { return d.color })
            svg.selectAll('.maturityLevelShape').data(maturityLevelsList)
                .transition().duration(1000).ease("quad")
                .attr('y', function(d) {
                    return d.level*levelHeight - levelHeight*0.5 + yTopMargin ;
                })
            svg.selectAll('.maturityLevelShape').data(maturityLevelsList).exit()
                
            svg.selectAll('.maturityLevelLabel').data(maturityLevelsList).enter()
                .append('text')
                .text(function(d) {return d.name} )
                .attr("class", "maturityLevelLabel")
                .attr("text-anchor", "left")
                .attr("x", function(d) {
                    return (0);
                })
                .attr("y", function(d) {
                    return ( d.level*levelHeight + yTopMargin + 3 );
                })
            svg.selectAll('.maturityLevelLabel').data(maturityLevelsList)
                .attr("x", function(d) {
                    return (0);
                })
                .attr("y", function(d) {
                    return ( d.level*levelHeight + yTopMargin + 3 );
                })
            
            svg.selectAll('.maturityLevelLabel').data(maturityLevelsList).exit()
        }
        
        var branchArrow = svg.selectAll(".arrow").data(branchArrows)
        branchArrow.enter()
            .append("line")
            .attr("class", function(d) { return "link arrow " + d.class } )
            .attr("marker-end", "url(#branchArrow)")
            .attr("x1", function(d) { return branchArrowNodes[d.s].x; })
            .attr("x2", function(d) { return branchArrowNodes[d.t].x; })
            .attr("y1", function(d) { return branchArrowNodes[d.s].y; })
            .attr("y2", function(d) { return branchArrowNodes[d.t].y; });
        branchArrow.transition().duration(1000).ease("quad")
            .attr("x1", function(d) { return branchArrowNodes[d.s].x; })
            .attr("x2", function(d) { return branchArrowNodes[d.t].x; })
            .attr("y1", function(d) { return branchArrowNodes[d.s].y; })
            .attr("y2", function(d) { return branchArrowNodes[d.t].y; });
        
        var tagConnectorEnter = svg.selectAll(".tagConnector").data(tagConnectors).enter()
        var tagConnectorUpdate = svg.selectAll(".tagConnector").data(tagConnectors)
        
        if(nodeArrows /*&& snapshotOnSeparateLevel */ ) {
            tagConnectorEnter
                .append("line")
                .attr("class", function(d) { return "tagConnector " + d.class })
                .attr("marker-end", "url(#tagArrow)")
                .attr("x1", function(d) { return tagConnectorNodes[d.s].x; })
                .attr("x2", function(d) { return tagConnectorNodes[d.t].x; })
                .attr("y1", function(d) { return tagConnectorNodes[d.s].y; })
                .attr("y2", function(d) { return tagConnectorNodes[d.t].y; })
            tagConnectorUpdate
                .attr("class", function(d) { return "tagConnector " + d.class })
                .attr("marker-end", "url(#tagArrow)")
                
        } else {
           //svg.selectAll('.tagConnector').remove()
           tagConnectorEnter
                .append("line")
                .attr("class", function(d) { return "tagConnector " + d.class })
                .attr("x1", function(d) { return tagConnectorNodes[d.s].x; })
                .attr("x2", function(d) { return tagConnectorNodes[d.t].x; })
                .attr("y1", function(d) { return tagConnectorNodes[d.s].y; })
                .attr("y2", function(d) { return tagConnectorNodes[d.t].y; }) 
            tagConnectorUpdate
                .attr("class", function(d) { return "tagConnector " + d.class })
                .attr("marker-end", "")
                
        }
        tagConnectorUpdate.transition().duration(1000).ease("quad")
            .attr("x1", function(d) { return tagConnectorNodes[d.s].x; })
            .attr("x2", function(d) { return tagConnectorNodes[d.t].x; })
            .attr("y1", function(d) { return tagConnectorNodes[d.s].y; })
            .attr("y2", function(d) { return tagConnectorNodes[d.t].y; })
        
        var branchConnector = svg.selectAll(".branchConnector").data(branchConnectors)
        branchConnector.enter()
            .append("line")
            .attr("class", function(d) { return "branchConnector " + d.class })
            .attr("x1", function(d) { return branchConnectorNodes[d.s].x; })
            .attr("x2", function(d) { return branchConnectorNodes[d.t].x; })
            .attr("y1", function(d) { return branchConnectorNodes[d.s].y; })
            .attr("y2", function(d) { return branchConnectorNodes[d.t].y; })
        branchConnector.transition().duration(1000).ease("quad")
            .attr("x1", function(d) { return branchConnectorNodes[d.s].x; })
            .attr("x2", function(d) { return branchConnectorNodes[d.t].x; })
            .attr("y1", function(d) { return branchConnectorNodes[d.s].y; })
            .attr("y2", function(d) { return branchConnectorNodes[d.t].y; })
        
        
        // ================ BRANCHES ========================
        
        var transformBranch = function(d) { 
            return "translate (" + branchArrowNodes[d.t].x + "," + (branchArrowNodes[d.t].y ) + ")"
        }
        
        var branchGroupEnter = svg.selectAll('.branchGroup').data(branchArrows).enter()
            .append("g")
            .attr('class', function (d) { return 'branchGroup ' + d.class } )
            .attr('transform', transformBranch)
        var branchGroupUpdate = svg.selectAll('.branchGroup').data(branchArrows)
        
        branchGroupUpdate.transition().duration(1000).ease("quad")
            .attr('transform', transformBranch) 
        svg.selectAll('.branchShape').data( []).exit()
            .transition().duration(200).ease('linear')
            .attr('r', 0)
            //.remove();
        svg.selectAll('.branchVersion').data([]).exit().remove();    
        if (useShapes) {
            branchGroupEnter.append('circle')
                .attr("class", "branchShape")
                .style("fill", '#eee')
                .style("stroke", 'black')
                .attr("cx", function(d) {
                    return (tagsDistance);
                })
                .attr('cy', function(d) {
                    return ( 0 );
                })
                .attr("r", 0)
                .transition().duration(200).ease('linear')
                .attr("r", tagTextMargin)
            branchGroupEnter.append("text")
                .text(function(d) { return d.version; })
                .attr("class", "branchVersion")
                .attr("text-anchor", "middle")
                .attr("x", function(d) {
                    return (tagsDistance);
                })
                .attr("y", function(d) {
                    return ( 3 );
                })
            branchGroupUpdate
                .append('circle')
                .attr("class", "branchShape")
                .style("fill", '#eee')
                .style("stroke", 'black')
                .attr("cx", function() {
                    return (tagsDistance);
                })
                .attr('cy', function() {
                    return ( 0 );
                })
//                .attr("r", 0)
//                .transition().duration(200).ease('linear')
                .attr("r", tagTextMargin)
            branchGroupUpdate.append("text")
                .text(function(d) { return d.version; })
                .attr("class", "branchVersion")
                .attr("text-anchor", "middle")
                .attr("x", function(d) {
                    return (tagsDistance);
                })
                .attr("y", function(d) {
                    return ( 3 );
                })
        } else {
            
            branchGroupEnter.append("text")
                .text(function(d) { return d.version; })
                .attr("class", "branchVersion")
                .attr("text-anchor", "middle")
                .attr("x", function() {
                    return (tagsDistance);
                })
                .attr("y", function() {
                    return ( 3 );
                })
            branchGroupUpdate.append("text")
                .text(function(d) { return d.version; })
                .attr("class", "branchVersion")
                .attr("text-anchor", "middle")
                .attr("x", function() {
                    return (tagsDistance);
                })
                .attr("y", function() {
                    return ( 3 );
                })
        }

        var branchText = svg.selectAll(".branchText").data(branchArrows)
        branchText.enter()
            .append("text")
            .text(function(d) { return "(" + d.branchName + ")"; })
            .attr("class", function(d) { return "branchText " + d.class } )
            .attr("text-anchor", "middle")
            .attr("x", function(d) {
                return ( branchArrowNodes[d.t].x + tagsDistance*0.99 );
            })
            .attr("y", function(d) {
                return ( branchArrowNodes[d.t].y + 22 );
            })
        branchText.transition().duration(1000).ease("quad")  
            .attr("x", function(d) {
                return ( branchArrowNodes[d.t].x + tagsDistance*0.99 );
            })
            .attr("y", function(d) {
                return ( branchArrowNodes[d.t].y + 22 );
            })    
            
        // ================ TAGS ========================
        
        
//        var transformTagFrom = function(d) { 
//            return "translate(" + (tagConnectorNodes[d.t].x) + ", " + (tagConnectorNodes[d.t].y + tagTextMargin) + ") scale(0)"
//        }
        var transformTag = function(d) { 
            return "translate(" + (tagConnectorNodes[d.t].x - tagTextMargin) + ", " + (tagConnectorNodes[d.t].y ) + ")"
        }
        
        var tagGroupEnter = svg.selectAll('.tagGroup').data(tagConnectors).enter()
            .append("g")
            .attr('class', function(d) { return 'tagGroup ' + d.class })
//            .attr('transform', transformTagFrom)
//            .transition().duration(200).ease('linear')
            .attr('transform', transformTag)
        var tagGroupUpdate = svg.selectAll('.tagGroup').data(tagConnectors)
//        var tagGroupExit = svg.selectAll('.tagGroup').data(tagConnectors).exit()
////            .transition().duration(200).ease('linear')
//            .attr('transform', transformTag)
        svg.selectAll('.tagGroup').data(tagConnectors).transition().duration(1000).ease("quad")
            .attr('transform', transformTag)
          
        if(true) {
            svg.selectAll('.tagShape').data( []).exit()
                .transition().duration(200).ease('linear')
                .attr('x', tagTextMargin)
                .attr('y', 0)
                .attr("width", 0)
                .attr("height", 0)
                //.remove();
        } else {
            svg.selectAll('.tagShape').data([]).exit().remove();
        }
        svg.selectAll('.tagVersion').data([]).exit().remove();
        if(useShapes) {
            tagGroupEnter.append('rect')
                .attr("class", "tagShape")
                .style("fill", '#eee')
                .style("stroke", 'black')
                .attr('x', 0)
                .attr('y', -tagTextMargin)
                .attr("width", 2*tagTextMargin)
                .attr("height", 2*tagTextMargin)
            tagGroupEnter.append("text")
                .text(function(d) { return d.version } )
                .attr("class", "tagVersion")
                .attr("text-anchor", "middle")
                .attr("x", tagTextMargin)
                .attr('y', function(d) {
                    return ( 3 );
                })
            tagGroupUpdate.append('rect')
                .attr("class", "tagShape")
                .style("fill", '#eee')
                .style("stroke", 'black')
                .attr('x', 0)
                .attr('y', -tagTextMargin)
                .attr("width", 2*tagTextMargin)
                .attr("height", 2*tagTextMargin)
            tagGroupUpdate.append("text")
                .text(function(d) { return d.version } )
                .attr("class", "tagVersion")
                .attr("text-anchor", "middle")
                .attr("x", tagTextMargin)
                .attr('y', function(d) {
                    return ( 3 );
                })
        } else {
            tagGroupEnter.append("text")
                .text(function(d) { return d.version } )
                .attr("class", "tagVersion")
                .attr("text-anchor", "middle")
                .attr("x", tagTextMargin)
                .attr('y', function(d) {
                    return ( 3 );
                })
            tagGroupUpdate.append("text")
                .text(function(d) { return d.version } )
                .attr("class", "tagVersion")
                .attr("text-anchor", "middle")
                .attr("x", tagTextMargin)
                .attr('y', function(d) {
                    return ( 3 );
                })
        }
        
        //if(useShapes) {
//            tagGroupEnter.selectAll('.tagShape').data(tagConnectors).enter()
//                .append('rect')
//                .attr("class", "tagShape")
//                .attr("width", 2*tagTextMargin)
//                .attr("height", 2*tagTextMargin)
//                .style("fill", '#eee')
//                .style("stroke", 'black')
//            tagGroupUpdate.append('rect')
//                .attr("class", "tagShape")
//                .attr("width", 2*tagTextMargin)
//                .attr("height", 2*tagTextMargin)
//                .style("fill", '#eee')
//                .style("stroke", 'black')
//            tagGroupEnter
//                .append('rect')
//                .attr("class", "tagShape")
//                .attr("width", 2*tagTextMargin)
//                .attr("height", 2*tagTextMargin)
//                .style("fill", '#eee')
//                .style("stroke", 'black')
//            tagGroupEnter.selectAll('.tagShape').data(tagConnectors)
//                .attr("class", "tagShape")
//                .attr("width", 2*tagTextMargin)
//                .attr("height", 2*tagTextMargin)
//                .style("fill", '#eee')
//                .style("stroke", 'black')
//            tagGroupEnter
//                .append("text")
//                .text(function(d) { return d.version } )
//                .attr("class", "tagVersion")
//                .attr("text-anchor", "middle")
//                .attr("x", tagTextMargin)
//                .attr('y', function(d) {
//                    return ( 3 + tagTextMargin );
//                })
//        } 
//        tagGroupEnter
//            .append("text")
//            .text(function(d) { return d.version } )
//            .attr("class", "tagVersion")
//            .attr("text-anchor", "middle")
//            .attr("x", tagTextMargin)
//            .attr('y', function(d) {
//                return ( 3 + tagTextMargin );
//            })
//        
//        tagGroup.transition().duration(1000).ease("quad")
//            .attr('transform', transformTag)
         
//        var tagVersion = svg.selectAll(".tagVersion").data(tagConnectors)
//        tagVersion.enter()
//            .append("text")
//            .text(function(d) { return d.version } )
//            .attr("class", "tagVersion")
//            .attr("text-anchor", "middle")
//            .attr("x", function(d) {
//                return ( tagConnectorNodes[d.t].x );
//            })
//            .attr('y', function(d) {
//                return ( tagConnectorNodes[d.t].y + 3 + tagTextMargin );
//            })
//        tagVersion.transition().duration(1000).ease("quad")
//            .attr("x", function(d) {
//                return ( tagConnectorNodes[d.t].x );
//            })
//            .attr('y', function(d) {
//                return ( tagConnectorNodes[d.t].y + 3 + tagTextMargin );
//            })
        
        
        
            
        
//        var force = d3.layout.force()
//            .charge(charge)
//            .linkDistance(linkDistance)
//            .size([width, height])
//            .nodes(data.nodes)
//            .links(data.links)
//            .start();

//        var link = svg.selectAll(".link")
//            .data(data.links)
//            .enter().append("line")
//            .attr("class", "link")
//            .style("stroke-width", function(d) { return Math.sqrt(d.value); });

//        var node = svg.selectAll(".node")
//            .data(data.nodes)
//            .enter().append('g')
//            .call(force.drag)
            
//        node.append("circle")
//            .attr("class", "node")
//            .attr("r", circleRadius)
//            .style("fill", function(d) { return color(d.group); })
//    
//        node.append('text')
//            .style("text-anchor", "middle")
//            .text(function(d) { return d.name; })
//
//        node.append("title")
//            .text(function(d) { return d.name; });
//
//        force.on("tick", function() {
//            link.attr("x1", function(d) { return d.source.x; })
//                .attr("y1", function(d) { return d.source.y; })
//                .attr("x2", function(d) { return d.target.x; })
//                .attr("y2", function(d) { return d.target.y; });
//
//            node.attr("transform", function(d) { 
//                return "translate(" + d.x + "," + d.y + ")"; 
//            })
//        });
    }
    
    var chart = function() {
        
        var dataFileArr = dataFile.split('.')
        var extension = dataFileArr[1];
        
        d3[extension].call(d3, dataFile, dataProcessing);
    }
    
    chart.margin = function(_) {
        if (!arguments.length)
            return margin;
        margin = _;
        return chart;
    };

    chart.width = function(_) {
        if (!arguments.length)
            return width;
        width = _;
        return chart;
    };

    chart.height = function(_) {
        if (!arguments.length)
            return height;
        height = _;
        return chart;
    };
    
    chart.dataFile  = function(_) {
        if (!arguments.length)
            return dataFile;
        dataFile = _;
        return dataFile;
    };
    
    chart.chartId  = function(_) {
        if (!arguments.length)
            return chartId;
        chartId = _;
        return chartId;
    };
    
    chart.charge  = function(_) {
        if (!arguments.length)
            return charge;
        charge = _;
        return charge;
    };
    
    chart.linkDistance  = function(_) {
        if (!arguments.length)
            return linkDistance;
        linkDistance = _;
        return linkDistance;
    };
    
    chart.circleRadius  = function(_) {
        if (!arguments.length)
            return circleRadius;
        circleRadius = _;
        return circleRadius;
    };
    
    chart.parentDOMElement  = function(_) {
        if (!arguments.length)
            return parentDOMElement;
        parentDOMElement = _;
        return parentDOMElement;
    };
    
    chart.snapshotOnSeparateLevel  = function(_) {
        if (!arguments.length)
            return snapshotOnSeparateLevel;
        snapshotOnSeparateLevel = _;
        return snapshotOnSeparateLevel;
    };
    
    chart.tagsDistance  = function(_) {
        if (!arguments.length)
            return tagsDistance;
        tagsDistance = _;
        return tagsDistance;
    };
    
    chart.levelHeight  = function(_) {
        if (!arguments.length)
            return levelHeight;
        levelHeight = _;
        return levelHeight;
    };
    
    chart.shapeSize  = function(_) {
        if (!arguments.length)
            return tagTextMargin;
        tagTextMargin = _/2;
        return tagTextMargin*2;
    };
    
    chart.useShapes  = function(_) {
        if (!arguments.length)
            return useShapes;
        useShapes = _;
        return useShapes;
    };
    
    chart.nodeArrows  = function(_) {
        if (!arguments.length)
            return nodeArrows;
        nodeArrows = _;
        return nodeArrows;
    };
    
    chart.maturityLevels  = function(_) {
        if (!arguments.length)
            return maturityLevels;
        maturityLevels = _;
        return maturityLevels;
    };
    
    chart.releaseBranches  = function(_) {
        if (!arguments.length)
            return displayReleaseBranches;
        displayReleaseBranches = _;
        return displayReleaseBranches;
    };
    
    chart.experimentalBranches = function(_) {
        if (!arguments.length)
            return displayExperimentalBranches;
        displayExperimentalBranches = _;
        return displayExperimentalBranches;
    };
    
    return chart;
}
