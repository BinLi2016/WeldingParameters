// Modern JavaScript for Welding Parameter Manager
const { ipcRenderer } = require('electron');

class WeldingParameterManager {
    constructor() {
        this.config = null;
        this.originalConfig = null;
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadConfiguration();
        this.updateLastUpdated();
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('parameterForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveConfiguration();
        });

        // Button event listeners
        document.getElementById('resetBtn').addEventListener('click', () => this.resetToDefaults());
        document.getElementById('refreshBtn').addEventListener('click', () => this.loadConfiguration());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportConfiguration());
        document.getElementById('backupBtn').addEventListener('click', () => this.createBackup());
        document.getElementById('validateBtn').addEventListener('click', () => this.validateParameters());

        // Real-time validation on input changes
        const inputs = document.querySelectorAll('input[type="number"], select');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.validateInput(input));
            input.addEventListener('blur', () => this.validateInput(input));
            input.addEventListener('change', () => this.validateInput(input));
        });
    }

    async loadConfiguration() {
        try {
            this.showStatus('正在加载配置...', 'info');
            this.config = await ipcRenderer.invoke('load-config');
            
            if (this.config) {
                this.originalConfig = JSON.parse(JSON.stringify(this.config));
                this.populateForm();
                this.showStatus('配置加载成功', 'success');
            } else {
                this.showStatus('配置加载失败，使用默认值', 'warning');
                this.populateForm(); // Still populate form with defaults
            }
        } catch (error) {
            console.error('Error loading configuration:', error);
            this.showStatus('加载配置时出错，使用默认值: ' + error.message, 'warning');
            this.populateForm(); // Still populate form with defaults
        }
    }

    populateForm() {
        if (this.config) {
            // Use config values if available
            // Basic Arc Parameters
            document.getElementById('arcNum').value = this.config.arcNum?.value || '';
            document.getElementById('arcTimeout').value = this.config.arcTimeout?.value || '';

            // Welding Parameters
            document.getElementById('weldVel').value = this.config.weldVel?.value || '';
            document.getElementById('weldCurr').value = this.config.weldCurr?.value || '';
            document.getElementById('weldVolt').value = this.config.weldVolt?.value || '';

            // Weaving Parameters
            document.getElementById('weaveNum').value = this.config.weaveNum?.value || '';
            document.getElementById('weaveType').value = this.config.weaveType?.value || '0';
            document.getElementById('weaveFreq').value = this.config.weaveFreq?.value || '';
            document.getElementById('weaveRange').value = this.config.weaveRange?.value || '';
            document.getElementById('weaveLeftStayTime').value = this.config.weaveLeftStayTime?.value || '';
            document.getElementById('weaveRightStayTime').value = this.config.weaveRightStayTime?.value || '';
            document.getElementById('weaveCircleRadio').value = this.config.weaveCircleRadio?.value ?? '';

            // Weave Mode Parameters
            document.getElementById('weaveIncStayTime').value = this.config.weaveIncStayTime?.value ?? '0';
            document.getElementById('weaveStationary').value = this.config.weaveStationary?.value ?? '0';
        } else {
            // Use default values if no config available
            // Basic Arc Parameters
            document.getElementById('arcNum').value = 1;
            document.getElementById('arcTimeout').value = 5000;

            // Welding Parameters
            document.getElementById('weldVel').value = 3;
            document.getElementById('weldCurr').value = 150;
            document.getElementById('weldVolt').value = 20;

            // Weaving Parameters
            document.getElementById('weaveNum').value = 1;
            document.getElementById('weaveType').value = 0;
            document.getElementById('weaveFreq').value = 2.0;
            document.getElementById('weaveRange').value = 2.0;
            document.getElementById('weaveLeftStayTime').value = 5.0;
            document.getElementById('weaveRightStayTime').value = 5.0;
            document.getElementById('weaveCircleRadio').value = 0;

            // Weave Mode Parameters
            document.getElementById('weaveIncStayTime').value = 0;
            document.getElementById('weaveStationary').value = 0;
            
            this.showStatus('使用默认值填充表单', 'info');
        }

        // Update current value displays
        this.updateCurrentValues();
    }

    updateCurrentValues() {
        if (this.config) {
            // Use config values if available
            // Basic Arc Parameters
            document.getElementById('arcNumValue').textContent = this.config.arcNum?.value !== undefined ? this.config.arcNum.value : '-';
            document.getElementById('arcTimeoutValue').textContent = this.config.arcTimeout?.value !== undefined ? this.config.arcTimeout.value : '-';

            // Welding Parameters
            document.getElementById('weldVelValue').textContent = this.config.weldVel?.value !== undefined ? this.config.weldVel.value : '-';
            document.getElementById('weldCurrValue').textContent = this.config.weldCurr?.value !== undefined ? this.config.weldCurr.value : '-';
            document.getElementById('weldVoltValue').textContent = this.config.weldVolt?.value !== undefined ? this.config.weldVolt.value : '-';

            // Weaving Parameters
            document.getElementById('weaveNumValue').textContent = this.config.weaveNum?.value !== undefined ? this.config.weaveNum.value : '-';
            document.getElementById('weaveTypeValue').textContent = this.config.weaveType?.value !== undefined ? this.config.weaveType.value : '-';
            document.getElementById('weaveFreqValue').textContent = this.config.weaveFreq?.value !== undefined ? this.config.weaveFreq.value : '-';
            document.getElementById('weaveRangeValue').textContent = this.config.weaveRange?.value !== undefined ? this.config.weaveRange.value : '-';
            document.getElementById('weaveLeftStayTimeValue').textContent = this.config.weaveLeftStayTime?.value !== undefined ? this.config.weaveLeftStayTime.value : '-';
            document.getElementById('weaveRightStayTimeValue').textContent = this.config.weaveRightStayTime?.value !== undefined ? this.config.weaveRightStayTime.value : '-';
            document.getElementById('weaveCircleRadioValue').textContent = this.config.weaveCircleRadio?.value !== undefined ? this.config.weaveCircleRadio.value : '-';

            // Weave Mode Parameters
            document.getElementById('weaveIncStayTimeValue').textContent = this.config.weaveIncStayTime?.value !== undefined ? this.config.weaveIncStayTime.value : '-';
            document.getElementById('weaveStationaryValue').textContent = this.config.weaveStationary?.value !== undefined ? this.config.weaveStationary.value : '-';
        } else {
            // Use form values if no config available
            // Basic Arc Parameters
            document.getElementById('arcNumValue').textContent = document.getElementById('arcNum').value !== '' ? document.getElementById('arcNum').value : '-';
            document.getElementById('arcTimeoutValue').textContent = document.getElementById('arcTimeout').value !== '' ? document.getElementById('arcTimeout').value : '-';

            // Welding Parameters
            document.getElementById('weldVelValue').textContent = document.getElementById('weldVel').value !== '' ? document.getElementById('weldVel').value : '-';
            document.getElementById('weldCurrValue').textContent = document.getElementById('weldCurr').value !== '' ? document.getElementById('weldCurr').value : '-';
            document.getElementById('weldVoltValue').textContent = document.getElementById('weldVolt').value !== '' ? document.getElementById('weldVolt').value : '-';

            // Weaving Parameters
            document.getElementById('weaveNumValue').textContent = document.getElementById('weaveNum').value !== '' ? document.getElementById('weaveNum').value : '-';
            document.getElementById('weaveTypeValue').textContent = document.getElementById('weaveType').value !== '' ? document.getElementById('weaveType').value : '-';
            document.getElementById('weaveFreqValue').textContent = document.getElementById('weaveFreq').value !== '' ? document.getElementById('weaveFreq').value : '-';
            document.getElementById('weaveRangeValue').textContent = document.getElementById('weaveRange').value !== '' ? document.getElementById('weaveRange').value : '-';
            document.getElementById('weaveLeftStayTimeValue').textContent = document.getElementById('weaveLeftStayTime').value !== '' ? document.getElementById('weaveLeftStayTime').value : '-';
            document.getElementById('weaveRightStayTimeValue').textContent = document.getElementById('weaveRightStayTime').value !== '' ? document.getElementById('weaveRightStayTime').value : '-';
            document.getElementById('weaveCircleRadioValue').textContent = document.getElementById('weaveCircleRadio').value !== '' ? document.getElementById('weaveCircleRadio').value : '-';

            // Weave Mode Parameters
            document.getElementById('weaveIncStayTimeValue').textContent = document.getElementById('weaveIncStayTime').value !== '' ? document.getElementById('weaveIncStayTime').value : '-';
            document.getElementById('weaveStationaryValue').textContent = document.getElementById('weaveStationary').value !== '' ? document.getElementById('weaveStationary').value : '-';
        }
    }

    async saveConfiguration() {
        try {
            this.showStatus('正在保存配置...', 'info');
            
            // Collect form data with fallback to default values if config is missing
            const formData = {
                arcNum: {
                    value: parseInt(document.getElementById('arcNum').value),
                    description: this.config?.arcNum?.description || "焊机配置文件编号",
                    range: this.config?.arcNum?.range || [0, 99],
                    default: this.config?.arcNum?.default || 1,
                    unit: this.config?.arcNum?.unit || "编号"
                },
                arcTimeout: {
                    value: parseInt(document.getElementById('arcTimeout').value),
                    description: this.config?.arcTimeout?.description || "起弧超时时间",
                    range: this.config?.arcTimeout?.range || [0, 60000],
                    default: this.config?.arcTimeout?.default || 5000,
                    unit: this.config?.arcTimeout?.unit || "ms"
                },
                weldVel: {
                    value: parseInt(document.getElementById('weldVel').value),
                    description: this.config?.weldVel?.description || "焊接速度",
                    range: this.config?.weldVel?.range || [1, 100],
                    default: this.config?.weldVel?.default || 3,
                    unit: this.config?.weldVel?.unit || "%"
                },
                weldCurr: {
                    value: parseFloat(document.getElementById('weldCurr').value),
                    description: this.config?.weldCurr?.description || "焊接电流",
                    range: this.config?.weldCurr?.range || [50, 500],
                    default: this.config?.weldCurr?.default || 150,
                    unit: this.config?.weldCurr?.unit || "A"
                },
                weldVolt: {
                    value: parseFloat(document.getElementById('weldVolt').value),
                    description: this.config?.weldVolt?.description || "焊接电压",
                    range: this.config?.weldVolt?.range || [10, 50],
                    default: this.config?.weldVolt?.default || 20,
                    unit: this.config?.weldVolt?.unit || "V"
                },
                weaveNum: {
                    value: parseInt(document.getElementById('weaveNum').value),
                    description: this.config?.weaveNum?.description || "摆动参数配置编号，设置为0时表明不使用摆动",
                    range: this.config?.weaveNum?.range || [0, 99],
                    default: this.config?.weaveNum?.default || 1,
                    unit: this.config?.weaveNum?.unit || "编号"
                },
                weaveType: {
                    value: parseInt(document.getElementById('weaveType').value),
                    description: this.config?.weaveType?.description || "摆动类型",
                    range: this.config?.weaveType?.range || [0, 7],
                    default: this.config?.weaveType?.default || 0,
                    unit: this.config?.weaveType?.unit || "类型"
                },
                weaveFreq: {
                    value: parseFloat(document.getElementById('weaveFreq').value),
                    description: this.config?.weaveFreq?.description || "摆动频率",
                    range: this.config?.weaveFreq?.range || [0.1, 10.0],
                    default: this.config?.weaveFreq?.default || 2.0,
                    unit: this.config?.weaveFreq?.unit || "Hz"
                },
                weaveRange: {
                    value: parseFloat(document.getElementById('weaveRange').value),
                    description: this.config?.weaveRange?.description || "摆动幅度，设置为0时表明不使用摆动",
                    range: this.config?.weaveRange?.range || [0, 20],
                    default: this.config?.weaveRange?.default || 2.0,
                    unit: this.config?.weaveRange?.unit || "mm"
                },
                weaveLeftStayTime: {
                    value: parseFloat(document.getElementById('weaveLeftStayTime').value),
                    description: this.config?.weaveLeftStayTime?.description || "摆动左停留时间",
                    range: this.config?.weaveLeftStayTime?.range || [0, 1000],
                    default: this.config?.weaveLeftStayTime?.default || 5.0,
                    unit: this.config?.weaveLeftStayTime?.unit || "ms"
                },
                weaveRightStayTime: {
                    value: parseFloat(document.getElementById('weaveRightStayTime').value),
                    description: this.config?.weaveRightStayTime?.description || "摆动右停留时间",
                    range: this.config?.weaveRightStayTime?.range || [0, 1000],
                    default: this.config?.weaveRightStayTime?.default || 5.0,
                    unit: this.config?.weaveRightStayTime?.unit || "ms"
                },
                weaveCircleRadio: {
                    value: parseInt(document.getElementById('weaveCircleRadio').value),
                    description: this.config?.weaveCircleRadio?.description || "圆形摆动-回调比率",
                    range: this.config?.weaveCircleRadio?.range || [0, 100],
                    default: this.config?.weaveCircleRadio?.default || 0,
                    unit: this.config?.weaveCircleRadio?.unit || "%"
                },
                weaveIncStayTime: {
                    value: parseInt(document.getElementById('weaveIncStayTime').value),
                    description: this.config?.weaveIncStayTime?.description || "等待模式，0-周期不包含等待时间；1-周期包含等待时间（必选参数）",
                    range: this.config?.weaveIncStayTime?.range || [0, 1],
                    default: this.config?.weaveIncStayTime?.default || 0,
                    unit: this.config?.weaveIncStayTime?.unit || "模式"
                },
                weaveStationary: {
                    value: parseInt(document.getElementById('weaveStationary').value),
                    description: this.config?.weaveStationary?.description || "摆动位置等待，0-等待时间内位置继续移动；1-等待时间内位置静止",
                    range: this.config?.weaveStationary?.range || [0, 1],
                    default: this.config?.weaveStationary?.default || 0,
                    unit: this.config?.weaveStationary?.unit || "模式"
                }
            };

            // Validate all inputs
            if (!this.validateAllInputs(formData)) {
                this.showStatus('请在保存前修复验证错误', 'warning');
                return;
            }

            // Save to file
            const result = await ipcRenderer.invoke('save-config', formData);
            
            if (result.success) {
                this.config = formData;
                this.originalConfig = JSON.parse(JSON.stringify(this.config));
                this.updateCurrentValues();
                this.updateLastUpdated();
                this.showStatus('配置保存成功', 'success');
            } else {
                this.showStatus('保存配置失败: ' + result.error, 'danger');
            }
        } catch (error) {
            console.error('Error saving configuration:', error);
            this.showStatus('保存配置时出错: ' + error.message, 'danger');
        }
    }

    validateInput(input) {
        const inputType = input.type;
        const inputTagName = input.tagName.toLowerCase();
        
        input.classList.remove('is-valid', 'is-invalid');
        
        if (inputTagName === 'select') {
            // For select elements, just check if a value is selected
            if (input.value !== '') {
                input.classList.add('is-valid');
                return true;
            } else {
                input.classList.add('is-invalid');
                return false;
            }
        }
        
        if (inputType === 'number') {
            const value = parseFloat(input.value);
            const min = parseFloat(input.min);
            const max = parseFloat(input.max);
            
            if (input.value === '') {
                input.classList.add('is-invalid');
                return false;
            }
            
            if (isNaN(value) || value < min || value > max) {
                input.classList.add('is-invalid');
                return false;
            }
            
            input.classList.add('is-valid');
            return true;
        }
        
        return true;
    }

    validateAllInputs(formData) {
        const inputs = document.querySelectorAll('input[type="number"], select');
        let allValid = true;
        
        inputs.forEach(input => {
            if (!this.validateInput(input)) {
                allValid = false;
            }
        });
        
        return allValid;
    }

    resetToDefaults() {
        if (confirm('确定要将所有参数重置为默认值吗？')) {
            if (this.config) {
                // Use config defaults if available
                // Basic Arc Parameters
                document.getElementById('arcNum').value = this.config.arcNum?.default || 1;
                document.getElementById('arcTimeout').value = this.config.arcTimeout?.default || 5000;

                // Welding Parameters
                document.getElementById('weldVel').value = this.config.weldVel?.default || 3;
                document.getElementById('weldCurr').value = this.config.weldCurr?.default || 150;
                document.getElementById('weldVolt').value = this.config.weldVolt?.default || 20;

                // Weaving Parameters
                document.getElementById('weaveNum').value = this.config.weaveNum?.default || 1;
                document.getElementById('weaveType').value = this.config.weaveType?.default || 0;
                document.getElementById('weaveFreq').value = this.config.weaveFreq?.default || 2.0;
                document.getElementById('weaveRange').value = this.config.weaveRange?.default || 2.0;
                document.getElementById('weaveLeftStayTime').value = this.config.weaveLeftStayTime?.default || 5.0;
                document.getElementById('weaveRightStayTime').value = this.config.weaveRightStayTime?.default || 5.0;
                document.getElementById('weaveCircleRadio').value = this.config.weaveCircleRadio?.default || 0;

                // Weave Mode Parameters
                document.getElementById('weaveIncStayTime').value = this.config.weaveIncStayTime?.default || 0;
                document.getElementById('weaveStationary').value = this.config.weaveStationary?.default || 0;
                
                this.showStatus('参数已重置为配置默认值', 'success');
            } else {
                // Use hardcoded defaults if no config available
                // Basic Arc Parameters
                document.getElementById('arcNum').value = 1;
                document.getElementById('arcTimeout').value = 5000;

                // Welding Parameters
                document.getElementById('weldVel').value = 3;
                document.getElementById('weldCurr').value = 150;
                document.getElementById('weldVolt').value = 20;

                // Weaving Parameters
                document.getElementById('weaveNum').value = 1;
                document.getElementById('weaveType').value = 0;
                document.getElementById('weaveFreq').value = 2.0;
                document.getElementById('weaveRange').value = 2.0;
                document.getElementById('weaveLeftStayTime').value = 5.0;
                document.getElementById('weaveRightStayTime').value = 5.0;
                document.getElementById('weaveCircleRadio').value = 0;

                // Weave Mode Parameters
                document.getElementById('weaveIncStayTime').value = 0;
                document.getElementById('weaveStationary').value = 0;
                
                this.showStatus('参数已重置为系统默认值', 'success');
            }
            
            // Validate the new values
            const inputs = document.querySelectorAll('input[type="number"], select');
            inputs.forEach(input => this.validateInput(input));
            
            // Update current value displays
            this.updateCurrentValues();
        }
    }

    async exportConfiguration() {
        try {
            const configToExport = {
                ...this.config,
                exportedAt: new Date().toISOString(),
                version: '1.0.0'
            };
            
            const dataStr = JSON.stringify(configToExport, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            // Create download link
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `welding_config_${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            this.showStatus('配置导出成功', 'success');
        } catch (error) {
            console.error('Error exporting configuration:', error);
            this.showStatus('导出配置时出错: ' + error.message, 'danger');
        }
    }

    async createBackup() {
        try {
            if (!this.originalConfig) {
                this.showStatus('没有配置可以备份', 'warning');
                return;
            }
            
            const backupData = {
                ...this.originalConfig,
                backupCreatedAt: new Date().toISOString(),
                originalFile: 'welding_config.json'
            };
            
            const result = await ipcRenderer.invoke('save-config', backupData);
            
            if (result.success) {
                this.showStatus('备份创建成功', 'success');
            } else {
                this.showStatus('创建备份失败: ' + result.error, 'danger');
            }
        } catch (error) {
            console.error('Error creating backup:', error);
            this.showStatus('创建备份时出错: ' + error.message, 'danger');
        }
    }

    validateParameters() {
        if (!this.config) {
            this.showStatus('没有配置可以验证', 'warning');
            return;
        }
        
        const validationResults = [];
        
        // Check each parameter
        Object.entries(this.config).forEach(([key, param]) => {
            const value = param.value;
            const [min, max] = param.range;
            
            if (value < min || value > max) {
                validationResults.push(`${key}: 值 ${value} 超出范围 [${min}, ${max}]`);
            }
        });
        
        if (validationResults.length === 0) {
            this.showStatus('所有参数都有效', 'success');
        } else {
            this.showStatus('验证错误: ' + validationResults.join(', '), 'danger');
        }
    }

    showStatus(message, type = 'info') {
        const statusElement = document.getElementById('statusMessage');
        statusElement.className = `alert alert-${type}`;
        statusElement.textContent = message;
        
        // Auto-hide success messages after 3 seconds
        if (type === 'success') {
            setTimeout(() => {
                statusElement.className = 'alert alert-info';
                statusElement.textContent = '就绪';
            }, 3000);
        }
    }

    updateLastUpdated() {
        const now = new Date();
        document.getElementById('lastUpdated').textContent = now.toLocaleString();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WeldingParameterManager();
}); 