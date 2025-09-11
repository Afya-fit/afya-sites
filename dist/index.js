"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectionRegistry = exports.BrandThemeProvider = exports.SectionRenderer = exports.PreviewPane = exports.SectionManager = exports.BuilderShell = exports.BuilderProvider = void 0;
// Builder exports
var BuilderProvider_1 = require("./builder/context/BuilderProvider");
Object.defineProperty(exports, "BuilderProvider", { enumerable: true, get: function () { return __importDefault(BuilderProvider_1).default; } });
var BuilderShell_1 = require("./builder/BuilderShell");
Object.defineProperty(exports, "BuilderShell", { enumerable: true, get: function () { return __importDefault(BuilderShell_1).default; } });
var SectionManager_1 = require("./builder/SectionManager");
Object.defineProperty(exports, "SectionManager", { enumerable: true, get: function () { return __importDefault(SectionManager_1).default; } });
var PreviewPane_1 = require("./builder/PreviewPane");
Object.defineProperty(exports, "PreviewPane", { enumerable: true, get: function () { return __importDefault(PreviewPane_1).default; } });
// Renderer exports
var SectionRenderer_1 = require("./renderer/SectionRenderer");
Object.defineProperty(exports, "SectionRenderer", { enumerable: true, get: function () { return __importDefault(SectionRenderer_1).default; } });
var BrandThemeProvider_1 = require("./renderer/theme/BrandThemeProvider");
Object.defineProperty(exports, "BrandThemeProvider", { enumerable: true, get: function () { return __importDefault(BrandThemeProvider_1).default; } });
exports.SectionRegistry = __importStar(require("./renderer/sectionRegistry"));
