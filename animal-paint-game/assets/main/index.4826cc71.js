System.register("chunks:///_virtual/main", ['./T0Proof.ts', './T1BathProof.ts', './T1PaintBuildProof.ts', './T1PaintBuildThreeDProof.ts', './T1ThreeDProof.ts'], function () {
  return {
    setters: [null, null, null, null, null],
    execute: function () {}
  };
});

System.register("chunks:///_virtual/T0Proof.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _inheritsLoose, cclegacy, _decorator, view, ResolutionPolicy, Node, Layers, UITransform, Canvas, Camera, Color, Button, Tween, tween, Vec3, Graphics, Label, HorizontalTextAlignment, VerticalTextAlignment, Component;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      view = module.view;
      ResolutionPolicy = module.ResolutionPolicy;
      Node = module.Node;
      Layers = module.Layers;
      UITransform = module.UITransform;
      Canvas = module.Canvas;
      Camera = module.Camera;
      Color = module.Color;
      Button = module.Button;
      Tween = module.Tween;
      tween = module.tween;
      Vec3 = module.Vec3;
      Graphics = module.Graphics;
      Label = module.Label;
      HorizontalTextAlignment = module.HorizontalTextAlignment;
      VerticalTextAlignment = module.VerticalTextAlignment;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "c74357TcjlCvYhCB+miLqZi", "T0Proof", undefined);
      var ccclass = _decorator.ccclass;
      var T0Proof = exports('T0Proof', (_dec = ccclass('T0Proof'), _dec(_class = /*#__PURE__*/function (_Component) {
        _inheritsLoose(T0Proof, _Component);
        function T0Proof() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _this.mover = void 0;
          _this.status = void 0;
          return _this;
        }
        var _proto = T0Proof.prototype;
        _proto.onLoad = function onLoad() {
          view.setDesignResolutionSize(390, 844, ResolutionPolicy.SHOW_ALL);
          view.resizeWithBrowserSize(true);
          var canvasNode = new Node('Canvas');
          canvasNode.layer = Layers.Enum.UI_2D;
          canvasNode.setPosition(195, 422, 0);
          this.node.addChild(canvasNode);
          var canvasTransform = canvasNode.addComponent(UITransform);
          canvasTransform.setContentSize(390, 844);
          var canvas = canvasNode.addComponent(Canvas);
          var cameraNode = new Node('UICamera');
          cameraNode.layer = Layers.Enum.UI_2D;
          cameraNode.setPosition(0, 0, 1000);
          canvasNode.addChild(cameraNode);
          var camera = cameraNode.addComponent(Camera);
          camera.projection = Camera.ProjectionType.ORTHO;
          camera.orthoHeight = 422;
          camera.near = 1;
          camera.far = 2000;
          camera.visibility = Layers.Enum.UI_2D;
          camera.clearColor = new Color(246, 251, 255, 255);
          canvas.cameraComponent = camera;
          this.addPanel(canvasNode, 'Background', 0, 0, 390, 844, 0, new Color(246, 251, 255, 255));
          this.addPanel(canvasNode, 'Card', 0, 22, 342, 620, 36, new Color(255, 255, 255, 255));
          this.addLabel(canvasNode, 'T0 技术样片', 0, 302, 32, new Color(35, 52, 74, 255), 330, true);
          this.addLabel(canvasNode, 'Cocos Creator · 纯 2D · TypeScript', 0, 260, 17, new Color(91, 113, 140, 255), 330);
          this.addPanel(canvasNode, 'BathArea', 0, 70, 280, 270, 42, new Color(229, 247, 255, 255));
          this.addLabel(canvasNode, '9:16 Canvas', 0, 153, 19, new Color(55, 129, 160, 255), 240, true);
          this.mover = this.addPanel(canvasNode, 'TweenNode', -82, 54, 54, 54, 16, new Color(79, 190, 220, 255));
          this.addLabel(this.mover, '水', 0, 0, 20, Color.WHITE, 54, true);
          this.status = this.addLabel(canvasNode, '点击按钮验证 Tween', 0, -101, 17, new Color(91, 113, 140, 255), 280);
          var buttonNode = this.addPanel(canvasNode, 'TweenButton', 0, -224, 238, 66, 24, new Color(255, 171, 91, 255));
          buttonNode.addComponent(Button);
          this.addLabel(buttonNode, '运行移动测试', 0, 0, 21, Color.WHITE, 220, true);
          buttonNode.on(Button.EventType.CLICK, this.runTween, this);
          this.addLabel(canvasNode, '只验证工程、点击与动效链，不代表正式 UI', 0, -318, 14, new Color(130, 147, 168, 255), 330);
          this.setAutomationStatus('ready');
        };
        _proto.runTween = function runTween() {
          var _this2 = this;
          Tween.stopAllByTarget(this.mover);
          this.mover.setPosition(-82, 54, 0);
          this.mover.setScale(1, 1, 1);
          this.status.string = 'Tween 运行中…';
          this.setAutomationStatus('running');
          tween(this.mover).to(0.5, {
            position: new Vec3(82, 54, 0),
            scale: new Vec3(1.18, 1.18, 1)
          }, {
            easing: 'quadOut'
          }).to(0.45, {
            position: new Vec3(-82, 54, 0),
            scale: Vec3.ONE
          }, {
            easing: 'quadInOut'
          }).call(function () {
            _this2.status.string = '点击 → TypeScript → Tween：通过';
            _this2.setAutomationStatus('passed');
          }).start();
        };
        _proto.setAutomationStatus = function setAutomationStatus(status) {
          if (typeof document !== 'undefined') {
            document.documentElement.dataset.t0Status = status;
          }
        };
        _proto.addPanel = function addPanel(parent, name, x, y, width, height, radius, color) {
          var node = new Node(name);
          node.layer = Layers.Enum.UI_2D;
          node.setPosition(x, y, 0);
          parent.addChild(node);
          node.addComponent(UITransform).setContentSize(width, height);
          var graphics = node.addComponent(Graphics);
          graphics.fillColor = color;
          graphics.roundRect(-width / 2, -height / 2, width, height, radius);
          graphics.fill();
          return node;
        };
        _proto.addLabel = function addLabel(parent, text, x, y, fontSize, color, width, bold) {
          if (bold === void 0) {
            bold = false;
          }
          var node = new Node("Label:" + text);
          node.layer = Layers.Enum.UI_2D;
          node.setPosition(x, y, 0);
          parent.addChild(node);
          node.addComponent(UITransform).setContentSize(width, fontSize * 1.8);
          var label = node.addComponent(Label);
          label.string = text;
          label.fontSize = fontSize;
          label.lineHeight = Math.round(fontSize * 1.3);
          label.color = color;
          label.isBold = bold;
          label.horizontalAlign = HorizontalTextAlignment.CENTER;
          label.verticalAlign = VerticalTextAlignment.CENTER;
          label.overflow = Label.Overflow.SHRINK;
          return label;
        };
        return T0Proof;
      }(Component)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/T1BathProof.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './T1ThreeDProof.ts', './T1PaintBuildProof.ts', './T1PaintBuildThreeDProof.ts'], function (exports) {
  var _inheritsLoose, _asyncToGenerator, _regeneratorRuntime, cclegacy, _decorator, Node, view, ResolutionPolicy, Layers, UITransform, Canvas, Camera, Color, Button, resources, SpriteFrame, Sprite, Vec3, tween, Tween, UIOpacity, Graphics, Label, HorizontalTextAlignment, VerticalTextAlignment, Component, T1ThreeDProof, T1PaintBuildProof, T1PaintBuildThreeDProof;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
      _asyncToGenerator = module.asyncToGenerator;
      _regeneratorRuntime = module.regeneratorRuntime;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
      view = module.view;
      ResolutionPolicy = module.ResolutionPolicy;
      Layers = module.Layers;
      UITransform = module.UITransform;
      Canvas = module.Canvas;
      Camera = module.Camera;
      Color = module.Color;
      Button = module.Button;
      resources = module.resources;
      SpriteFrame = module.SpriteFrame;
      Sprite = module.Sprite;
      Vec3 = module.Vec3;
      tween = module.tween;
      Tween = module.Tween;
      UIOpacity = module.UIOpacity;
      Graphics = module.Graphics;
      Label = module.Label;
      HorizontalTextAlignment = module.HorizontalTextAlignment;
      VerticalTextAlignment = module.VerticalTextAlignment;
      Component = module.Component;
    }, function (module) {
      T1ThreeDProof = module.T1ThreeDProof;
    }, function (module) {
      T1PaintBuildProof = module.T1PaintBuildProof;
    }, function (module) {
      T1PaintBuildThreeDProof = module.T1PaintBuildThreeDProof;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "45e22FLfoVLFaSs0ID88W+u", "T1BathProof", undefined);
      var ccclass = _decorator.ccclass;
      var T1BathProof = exports('T1BathProof', (_dec = ccclass('T1BathProof'), _dec(_class = /*#__PURE__*/function (_Component) {
        _inheritsLoose(T1BathProof, _Component);
        function T1BathProof() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _this.coral = new Color(255, 127, 114, 255);
          _this.coralDeep = new Color(211, 76, 70, 255);
          _this.sky = new Color(102, 169, 232, 255);
          _this.gold = new Color(245, 190, 71, 255);
          _this.canvasNode = void 0;
          _this.animalNode = void 0;
          _this.bucketNode = void 0;
          _this.bucketButton = void 0;
          _this.bucketOpacity = void 0;
          _this.bucketCount = void 0;
          _this.slotLabel = void 0;
          _this.status = void 0;
          _this.stains = [];
          _this.busy = false;
          return _this;
        }
        var _proto = T1BathProof.prototype;
        _proto.onLoad = function onLoad() {
          var mode = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('mode') : null;
          // v0.5 defaults to the confirmed paint-block build theme. The earlier bath
          // prototypes stay reachable with explicit query modes for regression only.
          if (mode === null || mode === 'paint-build' || mode === 'paint-build-2d') {
            var paintBuildHost = new Node('T1PaintBuildExperience');
            this.node.addChild(paintBuildHost);
            paintBuildHost.addComponent(T1PaintBuildProof);
            return;
          }
          if (mode === 'paint-build-3d') {
            var paintBuildThreeDHost = new Node('T1PaintBuildThreeDExperience');
            this.node.addChild(paintBuildThreeDHost);
            paintBuildThreeDHost.addComponent(T1PaintBuildThreeDProof);
            return;
          }
          if (mode === '3d') {
            var threeDHost = new Node('T1ThreeDExperience');
            this.node.addChild(threeDHost);
            threeDHost.addComponent(T1ThreeDProof);
            return;
          }
          view.setDesignResolutionSize(390, 844, ResolutionPolicy.SHOW_ALL);
          view.resizeWithBrowserSize(true);
          this.createCanvas();
          this.createStaticLayout();
          this.loadAnimal();
        };
        _proto.createCanvas = function createCanvas() {
          this.canvasNode = new Node('Canvas');
          this.canvasNode.layer = Layers.Enum.UI_2D;
          this.canvasNode.setPosition(195, 422, 0);
          this.node.addChild(this.canvasNode);
          this.canvasNode.addComponent(UITransform).setContentSize(390, 844);
          var canvas = this.canvasNode.addComponent(Canvas);
          var cameraNode = new Node('UICamera');
          cameraNode.layer = Layers.Enum.UI_2D;
          cameraNode.setPosition(0, 0, 1000);
          this.canvasNode.addChild(cameraNode);
          var camera = cameraNode.addComponent(Camera);
          camera.projection = Camera.ProjectionType.ORTHO;
          camera.orthoHeight = 422;
          camera.near = 1;
          camera.far = 2000;
          camera.visibility = Layers.Enum.UI_2D;
          camera.clearColor = new Color(239, 249, 252, 255);
          canvas.cameraComponent = camera;
        };
        _proto.createStaticLayout = function createStaticLayout() {
          this.addPanel(this.canvasNode, 'Background', 0, 0, 390, 844, 0, new Color(239, 249, 252, 255));
          this.addPanel(this.canvasNode, 'MainCard', 0, 8, 354, 786, 34, Color.WHITE);
          this.addLabel(this.canvasNode, '真实角色与清洗反馈样片', 0, 355, 24, new Color(35, 52, 74, 255), 330, true);
          this.addLabel(this.canvasNode, '实际 Cocos 运行画面 · 非概念图', 0, 322, 14, new Color(99, 120, 143, 255), 320);
          this.addPanel(this.canvasNode, 'BathPanel', 0, 82, 324, 446, 34, new Color(226, 246, 250, 255));
          this.addPanel(this.canvasNode, 'AssetChip', 0, 278, 174, 28, 14, new Color(255, 255, 255, 220));
          this.addLabel(this.canvasNode, '分层游戏对象 · 2D Sprite', 0, 278, 12, new Color(58, 133, 151, 255), 170, true);
          this.status = this.addLabel(this.canvasNode, '正在导入真实角色资产…', 0, -163, 15, new Color(82, 106, 132, 255), 310);
          this.addPanel(this.canvasNode, 'Slot', 0, -222, 206, 62, 22, new Color(233, 239, 244, 255));
          this.slotLabel = this.addLabel(this.canvasNode, '洗澡位 0 / 1', 0, -222, 16, new Color(105, 125, 147, 255), 190, true);
          this.bucketNode = this.createBucket(this.canvasNode, 0, -317);
          this.bucketButton = this.bucketNode.addComponent(Button);
          this.bucketNode.on(Button.EventType.CLICK, this.startBathSample, this);
          this.addLabel(this.canvasNode, 'T1 只验证角色、可读性与命中满足感，不代表完整 UI', 0, -384, 12, new Color(133, 151, 169, 255), 340);
        };
        _proto.loadAnimal = function loadAnimal() {
          var _this2 = this;
          resources.load('characters/bunny-t1-v1/spriteFrame', SpriteFrame, function (error, spriteFrame) {
            if (error) {
              _this2.status.string = '角色资产导入失败';
              _this2.setAutomationStatus('asset-error');
              console.error(error);
              return;
            }
            _this2.animalNode = new Node('BunnySprite');
            _this2.animalNode.layer = Layers.Enum.UI_2D;
            _this2.animalNode.setPosition(0, 74, 0);
            _this2.canvasNode.addChild(_this2.animalNode);
            var animalTransform = _this2.animalNode.addComponent(UITransform);
            var sprite = _this2.animalNode.addComponent(Sprite);
            sprite.sizeMode = Sprite.SizeMode.CUSTOM;
            sprite.spriteFrame = spriteFrame;
            // Assigning a SpriteFrame can restore its raw pixel size. Re-apply the
            // gameplay size afterwards so source artwork resolution never controls UI layout.
            animalTransform.setContentSize(238, 357);
            _this2.createStains();
            _this2.status.string = '点珊瑚红水桶，水珠会自动寻找同色污渍';
            _this2.startBreathing();
            _this2.setAutomationStatus('ready');
          });
        };
        _proto.createStains = function createStains() {
          // Soft mini tiles read as a removable color layer instead of facial blush or UI badges.
          var behind = this.addStain(this.animalNode, 'BehindSky', -42, -3, 12, 'square', this.sky, 125);
          behind.setScale(0.9, 0.9, 1);
          var first = this.addStain(this.animalNode, 'FrontCoral', -53, -10, 18, 'square', this.coral, 255);
          var second = this.addStain(this.animalNode, 'SecondCoral', 43, -70, 18, 'square', this.coral, 255);
          this.addStain(this.animalNode, 'GoldPreview', 39, 104, 16, 'square', this.gold, 255);
          this.stains = [{
            front: first,
            behind: behind,
            position: new Vec3(-53, -10, 0)
          }, {
            front: second,
            position: new Vec3(43, -70, 0)
          }];
        };
        _proto.startBathSample = /*#__PURE__*/function () {
          var _startBathSample = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
            var index, target;
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  if (!(this.busy || !this.animalNode)) {
                    _context.next = 2;
                    break;
                  }
                  return _context.abrupt("return");
                case 2:
                  this.busy = true;
                  this.bucketButton.interactable = false;
                  this.slotLabel.string = '洗澡位 1 / 1 · 自动清洗中';
                  this.status.string = '水桶入位，自动寻找珊瑚红污渍…';
                  this.setAutomationStatus('running');
                  Tween.stopAllByTarget(this.bucketNode);
                  tween(this.bucketNode).to(0.32, {
                    position: new Vec3(0, -222, 0),
                    scale: new Vec3(0.9, 0.9, 1)
                  }, {
                    easing: 'quadOut'
                  }).start();
                  _context.next = 11;
                  return this.wait(0.45);
                case 11:
                  index = 0;
                case 12:
                  if (!(index < this.stains.length)) {
                    _context.next = 25;
                    break;
                  }
                  target = this.stains[index];
                  this.bucketCount.string = String(this.stains.length - index);
                  _context.next = 17;
                  return this.flyDroplet(target.position);
                case 17:
                  _context.next = 19;
                  return this.playHit(target);
                case 19:
                  this.bucketCount.string = String(this.stains.length - index - 1);
                  _context.next = 22;
                  return this.wait(0.32);
                case 22:
                  index += 1;
                  _context.next = 12;
                  break;
                case 25:
                  this.slotLabel.string = '水桶用完 · 洗澡位已释放';
                  this.status.string = '命中反馈完成：后续天空蓝已清楚露出';
                  tween(this.bucketNode).to(0.26, {
                    position: new Vec3(0, -252, 0),
                    scale: new Vec3(0.68, 0.68, 1)
                  }, {
                    easing: 'quadIn'
                  }).start();
                  tween(this.bucketOpacity).to(0.22, {
                    opacity: 0
                  }).start();
                  this.playCelebration();
                  this.setAutomationStatus('passed');
                  _context.next = 33;
                  return this.wait(2.3);
                case 33:
                  this.resetSample();
                case 34:
                case "end":
                  return _context.stop();
              }
            }, _callee, this);
          }));
          function startBathSample() {
            return _startBathSample.apply(this, arguments);
          }
          return startBathSample;
        }();
        _proto.flyDroplet = function flyDroplet(localTarget) {
          var _this3 = this;
          return new Promise(function (resolve) {
            var droplet = _this3.createDroplet(_this3.canvasNode, 0, -222);
            var target = new Vec3(_this3.animalNode.position.x + localTarget.x, _this3.animalNode.position.y + localTarget.y, 0);
            tween(droplet).to(0.65, {
              position: target,
              scale: new Vec3(0.82, 1.16, 1)
            }, {
              easing: 'quadIn'
            }).call(function () {
              droplet.destroy();
              resolve();
            }).start();
          });
        };
        _proto.playHit = function playHit(target) {
          var _this4 = this;
          return new Promise(function (resolve) {
            Tween.stopAllByTarget(_this4.animalNode);
            tween(_this4.animalNode).to(0.1, {
              angle: -2,
              scale: new Vec3(1.025, 0.985, 1)
            }).to(0.16, {
              angle: 1.4,
              scale: new Vec3(0.99, 1.02, 1)
            }).to(0.18, {
              angle: 0,
              scale: Vec3.ONE
            }).call(function () {
              return _this4.startBreathing();
            }).start();
            var opacity = target.front.getComponent(UIOpacity);
            tween(target.front).to(0.16, {
              scale: new Vec3(1.18, 1.18, 1)
            }, {
              easing: 'quadOut'
            }).to(0.25, {
              scale: new Vec3(0.2, 0.2, 1)
            }).start();
            tween(opacity).delay(0.12).to(0.29, {
              opacity: 0
            }).call(function () {
              if (target.behind) {
                var behindOpacity = target.behind.getComponent(UIOpacity);
                tween(target.behind).to(0.34, {
                  scale: Vec3.ONE
                }, {
                  easing: 'backOut'
                }).start();
                tween(behindOpacity).to(0.26, {
                  opacity: 255
                }).start();
              }
              resolve();
            }).start();
            _this4.createSplash(_this4.canvasNode, _this4.animalNode.position.x + target.position.x, _this4.animalNode.position.y + target.position.y);
          });
        };
        _proto.playCelebration = function playCelebration() {
          var _this5 = this;
          Tween.stopAllByTarget(this.animalNode);
          tween(this.animalNode).to(0.18, {
            scale: new Vec3(1.055, 0.965, 1),
            angle: -1.5
          }).to(0.24, {
            scale: new Vec3(0.98, 1.045, 1),
            angle: 1.5
          }).to(0.24, {
            scale: Vec3.ONE,
            angle: 0
          }, {
            easing: 'backOut'
          }).call(function () {
            return _this5.startBreathing();
          }).start();
          var _loop = function _loop() {
            var angle = Math.PI * 2 * index / 9;
            var bubble = _this5.addDot(_this5.canvasNode, "Celebrate" + index, Math.cos(angle) * 54, 70 + Math.sin(angle) * 96, 8 + index % 3 * 2, index % 2 === 0 ? new Color(121, 205, 228, 205) : new Color(255, 255, 255, 220));
            var opacity = bubble.addComponent(UIOpacity);
            tween(bubble).by(0.7, {
              position: new Vec3(Math.cos(angle) * 28, 35 + Math.sin(angle) * 28, 0),
              scale: new Vec3(0.35, 0.35, 0)
            }).call(function () {
              return bubble.destroy();
            }).start();
            tween(opacity).delay(0.28).to(0.42, {
              opacity: 0
            }).start();
          };
          for (var index = 0; index < 9; index += 1) {
            _loop();
          }
        };
        _proto.resetSample = function resetSample() {
          this.stains.forEach(function (target) {
            target.front.setScale(1, 1, 1);
            target.front.getComponent(UIOpacity).opacity = 255;
            if (target.behind) {
              target.behind.setScale(0.9, 0.9, 1);
              target.behind.getComponent(UIOpacity).opacity = 125;
            }
          });
          this.bucketNode.setPosition(0, -317, 0);
          this.bucketNode.setScale(1, 1, 1);
          this.bucketOpacity.opacity = 255;
          this.bucketCount.string = '2';
          this.bucketButton.interactable = true;
          this.slotLabel.string = '洗澡位 0 / 1';
          this.status.string = '点珊瑚红水桶，水珠会自动寻找同色污渍';
          this.busy = false;
          this.startBreathing();
          this.setAutomationStatus('ready');
        };
        _proto.startBreathing = function startBreathing() {
          if (!this.animalNode || this.busy) {
            return;
          }
          Tween.stopAllByTarget(this.animalNode);
          tween(this.animalNode).repeatForever(tween(this.animalNode).to(1.45, {
            scale: new Vec3(1.012, 0.99, 1)
          }, {
            easing: 'sineInOut'
          }).to(1.45, {
            scale: Vec3.ONE
          }, {
            easing: 'sineInOut'
          })).start();
        };
        _proto.createSplash = function createSplash(parent, x, y) {
          var _this6 = this;
          var _loop2 = function _loop2() {
            var angle = Math.PI * 2 * index / 7;
            var dot = _this6.addDot(parent, "Splash" + index, x, y, 6 + index % 2 * 3, new Color(255, 154, 143, 235));
            var opacity = dot.addComponent(UIOpacity);
            tween(dot).by(0.38, {
              position: new Vec3(Math.cos(angle) * 34, Math.sin(angle) * 29, 0),
              scale: new Vec3(-0.45, -0.45, 0)
            }, {
              easing: 'quadOut'
            }).call(function () {
              return dot.destroy();
            }).start();
            tween(opacity).delay(0.14).to(0.24, {
              opacity: 0
            }).start();
          };
          for (var index = 0; index < 7; index += 1) {
            _loop2();
          }
        };
        _proto.createDroplet = function createDroplet(parent, x, y) {
          var node = this.addDot(parent, 'WaterDroplet', x, y, 17, this.coral);
          var shine = this.addDot(node, 'Shine', -4, 5, 4, new Color(255, 255, 255, 210));
          shine.setScale(0.8, 1.25, 1);
          return node;
        };
        _proto.createBucket = function createBucket(parent, x, y) {
          var node = new Node('CoralBucket');
          node.layer = Layers.Enum.UI_2D;
          node.setPosition(x, y, 0);
          parent.addChild(node);
          node.addComponent(UITransform).setContentSize(118, 76);
          this.bucketOpacity = node.addComponent(UIOpacity);
          var graphics = node.addComponent(Graphics);
          graphics.lineWidth = 7;
          graphics.strokeColor = this.coralDeep;
          graphics.arc(0, 12, 33, Math.PI, 0, false);
          graphics.stroke();
          graphics.fillColor = this.coral;
          graphics.roundRect(-49, -31, 98, 58, 18);
          graphics.fill();
          graphics.strokeColor = this.coralDeep;
          graphics.lineWidth = 3;
          graphics.roundRect(-49, -31, 98, 58, 18);
          graphics.stroke();
          this.addLabel(node, '珊瑚红', -10, -2, 14, Color.WHITE, 72, true);
          var countPanel = this.addPanel(node, 'Count', 35, -2, 30, 30, 15, Color.WHITE);
          this.bucketCount = this.addLabel(countPanel, '2', 0, 0, 15, this.coralDeep, 28, true);
          return node;
        };
        _proto.addStain = function addStain(parent, name, x, y, size, shape, color, opacityValue) {
          var node = new Node(name);
          node.layer = Layers.Enum.UI_2D;
          node.setPosition(x, y, 0);
          parent.addChild(node);
          node.addComponent(UITransform).setContentSize(size, size);
          var graphics = node.addComponent(Graphics);
          var edge = new Color(Math.max(0, color.r - 42), Math.max(0, color.g - 42), Math.max(0, color.b - 42), 155);
          graphics.fillColor = new Color(55, 68, 80, 32);
          if (shape === 'circle') {
            graphics.circle(1, -1.5, size / 2);
          } else {
            graphics.roundRect(-size / 2 + 1, -size / 2 - 1.5, size, size, size * 0.28);
          }
          graphics.fill();
          graphics.fillColor = color;
          if (shape === 'circle') {
            graphics.circle(0, 0, size / 2 - 1);
          } else {
            graphics.roundRect(-size / 2 + 1, -size / 2 + 1, size - 2, size - 2, size * 0.24);
          }
          graphics.fill();
          graphics.lineWidth = 1.25;
          graphics.strokeColor = edge;
          graphics.stroke();
          graphics.fillColor = new Color(255, 255, 255, 150);
          graphics.circle(-size * 0.19, size * 0.2, Math.max(1.5, size * 0.1));
          graphics.fill();
          var opacity = node.addComponent(UIOpacity);
          opacity.opacity = opacityValue;
          return node;
        };
        _proto.addDot = function addDot(parent, name, x, y, size, color) {
          var node = new Node(name);
          node.layer = Layers.Enum.UI_2D;
          node.setPosition(x, y, 0);
          parent.addChild(node);
          node.addComponent(UITransform).setContentSize(size, size);
          var graphics = node.addComponent(Graphics);
          graphics.fillColor = color;
          graphics.circle(0, 0, size / 2);
          graphics.fill();
          return node;
        };
        _proto.addPanel = function addPanel(parent, name, x, y, width, height, radius, color) {
          var node = new Node(name);
          node.layer = Layers.Enum.UI_2D;
          node.setPosition(x, y, 0);
          parent.addChild(node);
          node.addComponent(UITransform).setContentSize(width, height);
          var graphics = node.addComponent(Graphics);
          graphics.fillColor = color;
          graphics.roundRect(-width / 2, -height / 2, width, height, radius);
          graphics.fill();
          return node;
        };
        _proto.addLabel = function addLabel(parent, text, x, y, fontSize, color, width, bold) {
          if (bold === void 0) {
            bold = false;
          }
          var node = new Node("Label:" + text);
          node.layer = Layers.Enum.UI_2D;
          node.setPosition(x, y, 0);
          parent.addChild(node);
          node.addComponent(UITransform).setContentSize(width, fontSize * 1.9);
          var label = node.addComponent(Label);
          label.string = text;
          label.fontSize = fontSize;
          label.lineHeight = Math.round(fontSize * 1.3);
          label.color = color;
          label.isBold = bold;
          label.horizontalAlign = HorizontalTextAlignment.CENTER;
          label.verticalAlign = VerticalTextAlignment.CENTER;
          label.overflow = Label.Overflow.SHRINK;
          return label;
        };
        _proto.wait = function wait(seconds) {
          var _this7 = this;
          return new Promise(function (resolve) {
            return _this7.scheduleOnce(resolve, seconds);
          });
        };
        _proto.setAutomationStatus = function setAutomationStatus(status) {
          if (typeof document !== 'undefined') {
            document.documentElement.dataset.t1Status = status;
          }
        };
        return T1BathProof;
      }(Component)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/T1PaintBuildProof.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _inheritsLoose, _createClass, _asyncToGenerator, _regeneratorRuntime, cclegacy, _decorator, screen, Vec3, view, ResolutionPolicy, AudioSource, Node, Layers, UITransform, Canvas, Camera, Color, Button, UIOpacity, Graphics, Tween, Label, Sprite, resources, SpriteFrame, AudioClip, tween, HorizontalTextAlignment, VerticalTextAlignment, Component;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
      _createClass = module.createClass;
      _asyncToGenerator = module.asyncToGenerator;
      _regeneratorRuntime = module.regeneratorRuntime;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      screen = module.screen;
      Vec3 = module.Vec3;
      view = module.view;
      ResolutionPolicy = module.ResolutionPolicy;
      AudioSource = module.AudioSource;
      Node = module.Node;
      Layers = module.Layers;
      UITransform = module.UITransform;
      Canvas = module.Canvas;
      Camera = module.Camera;
      Color = module.Color;
      Button = module.Button;
      UIOpacity = module.UIOpacity;
      Graphics = module.Graphics;
      Tween = module.Tween;
      Label = module.Label;
      Sprite = module.Sprite;
      resources = module.resources;
      SpriteFrame = module.SpriteFrame;
      AudioClip = module.AudioClip;
      tween = module.tween;
      HorizontalTextAlignment = module.HorizontalTextAlignment;
      VerticalTextAlignment = module.VerticalTextAlignment;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "0a5d2jOHohJqJPPERl0HwZr", "T1PaintBuildProof", undefined);
      var ccclass = _decorator.ccclass;
      var T1PaintBuildProof = exports('T1PaintBuildProof', (_dec = ccclass('T1PaintBuildProof'), _dec(_class = /*#__PURE__*/function (_Component) {
        _inheritsLoose(T1PaintBuildProof, _Component);
        function T1PaintBuildProof() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _this.paintDefinitions = [{
            id: 'cream',
            name: '珊瑚橙',
            shortName: '珊橙',
            color: new Color(247, 126, 91, 255),
            deep: new Color(185, 68, 55, 255),
            total: 0
          }, {
            id: 'ivory',
            name: '阳光黄',
            shortName: '阳黄',
            color: new Color(255, 207, 74, 255),
            deep: new Color(194, 132, 35, 255),
            total: 0
          }, {
            id: 'oat',
            name: '湖水蓝',
            shortName: '湖蓝',
            color: new Color(72, 188, 218, 255),
            deep: new Color(39, 119, 163, 255),
            total: 0
          }, {
            id: 'cocoa',
            name: '葡萄紫',
            shortName: '葡紫',
            color: new Color(137, 105, 204, 255),
            deep: new Color(80, 61, 150, 255),
            total: 0
          }, {
            id: 'blush',
            name: '樱花粉',
            shortName: '樱粉',
            color: new Color(241, 112, 170, 255),
            deep: new Color(175, 63, 125, 255),
            total: 0
          }];
          _this.animalLevels = [{
            id: 'bunny',
            levelNumber: 12,
            name: '兔兔',
            resourceDir: 'bunny-2d-sequence-v1'
          }, {
            id: 'kitten',
            levelNumber: 13,
            name: '猫猫',
            resourceDir: 'kitten-2d-sequence-v1'
          }];
          _this.currentLevelIndex = 0;
          _this.paintBatchPlans = [];
          _this.slotPositions = [-132, -66, 0, 66, 132].map(function (x) {
            return new Vec3(x, -86, 0);
          });
          _this.designHeight = 844;
          _this.compactLayout = false;
          _this.canvasNode = void 0;
          _this.blockAnimal = void 0;
          _this.finalAnimal = void 0;
          _this.guideAnimal = void 0;
          _this.guideAnimalSprite = void 0;
          _this.guideAnimalOpacity = void 0;
          _this.finalAnimalOpacity = void 0;
          _this.finalAnimalSprite = void 0;
          _this.finalAnimalFrames = void 0;
          _this.animalFrames = new Map();
          _this.levelLabel = void 0;
          _this.status = void 0;
          _this.statusToast = void 0;
          _this.statusToastOpacity = void 0;
          _this.statusEpoch = 0;
          _this.progressLabel = void 0;
          _this.progressFill = void 0;
          _this.sceneCard = void 0;
          _this.boardGraphics = void 0;
          _this.resultScrim = void 0;
          _this.resultBanner = void 0;
          _this.resultTitle = void 0;
          _this.resultDetail = void 0;
          _this.resultPrimaryButton = void 0;
          _this.resultPrimaryLabel = void 0;
          _this.resultSecondaryButton = void 0;
          _this.resultSecondaryLabel = void 0;
          _this.resultMode = null;
          _this.settingsButton = void 0;
          _this.settingsButtonOpacity = void 0;
          _this.settingsScrim = void 0;
          _this.settingsPanel = void 0;
          _this.soundToggleLabel = void 0;
          _this.hapticsToggleLabel = void 0;
          _this.undoButton = void 0;
          _this.undoButtonOpacity = void 0;
          _this.restartButton = void 0;
          _this.restartButtonOpacity = void 0;
          _this.slotLabels = [];
          _this.slotNodes = [];
          _this.cells = [];
          _this.trays = [];
          _this.activeSlots = Array(5).fill(null);
          _this.history = [];
          _this.transientNodes = [];
          _this.audioSource = void 0;
          _this.audioClips = new Map();
          _this.soundPlayedAt = new Map();
          _this.landedSoundCounter = 0;
          _this.boardMinColumn = -10;
          _this.boardMaxColumn = 10;
          _this.boardMinRow = 0;
          _this.boardMaxRow = 22;
          _this.totalRows = 23;
          _this.blockVisualSize = 14.7;
          _this.boardPitch = 14;
          _this.boardBaseY = 0;
          _this.workingSlotCount = 0;
          _this.resolving = false;
          _this.resolveRequested = false;
          _this.movingCarCount = 0;
          _this.terminal = false;
          _this.completionWon = false;
          _this.gamePaused = false;
          _this.soundEnabled = true;
          _this.hapticsEnabled = true;
          _this.revealMilestone = 0;
          _this.keyboardHandler = void 0;
          return _this;
        }
        var _proto = T1PaintBuildProof.prototype;
        _proto.onLoad = function onLoad() {
          var _this2 = this;
          var frameSize = screen.windowSize;
          this.compactLayout = frameSize.height / Math.max(1, frameSize.width) < 1.95;
          this.designHeight = this.compactLayout ? 692 : 844;
          this.slotPositions = [-132, -66, 0, 66, 132].map(function (x) {
            return new Vec3(x, _this2.compactLayout ? -74 : -86, 0);
          });
          view.setDesignResolutionSize(390, this.designHeight, ResolutionPolicy.SHOW_ALL);
          view.resizeWithBrowserSize(true);
          this.loadPreferences();
          this.setAutomationStatus('loading');
          this.createCanvas();
          this.audioSource = this.canvasNode.addComponent(AudioSource);
          this.createLayout();
          this.createBlueprint();
          this.createPaintTrays();
          this.loadAudio();
          this.loadFinalAnimal();
          this.setupKeyboardControls();
        };
        _proto.createCanvas = function createCanvas() {
          this.canvasNode = new Node('PaintBuildCanvas');
          this.canvasNode.layer = Layers.Enum.UI_2D;
          this.canvasNode.setPosition(195, this.designHeight / 2, 0);
          this.node.addChild(this.canvasNode);
          this.canvasNode.addComponent(UITransform).setContentSize(390, this.designHeight);
          var canvas = this.canvasNode.addComponent(Canvas);
          var cameraNode = new Node('PaintBuildCamera');
          cameraNode.layer = Layers.Enum.UI_2D;
          cameraNode.setPosition(0, 0, 1000);
          this.canvasNode.addChild(cameraNode);
          var camera = cameraNode.addComponent(Camera);
          camera.projection = Camera.ProjectionType.ORTHO;
          camera.orthoHeight = this.designHeight / 2;
          camera.near = 1;
          camera.far = 2000;
          camera.visibility = Layers.Enum.UI_2D;
          camera.clearColor = new Color(246, 242, 252, 255);
          canvas.cameraComponent = camera;
        };
        _proto.createLayout = function createLayout() {
          var _this3 = this;
          var y = function y(regular, compact) {
            return _this3.compactLayout ? compact : regular;
          };
          var sceneHeight = this.compactLayout ? 328 : 430;
          var sceneY = y(190, 145);
          this.addPanel(this.canvasNode, 'Background', 0, 0, 390, this.designHeight, 0, new Color(170, 169, 197, 255));
          this.addPanel(this.canvasNode, 'QueueBackdrop', 0, y(-310, -245), 390, this.compactLayout ? 202 : 224, 0, new Color(111, 117, 163, 255));
          this.addPanel(this.canvasNode, 'QueueTopLight', 0, y(-199, -144), 390, 4, 0, new Color(220, 222, 245, 82));
          this.sceneCard = this.addOutlinedPanel(this.canvasNode, 'PixelBoardFrame', 0, sceneY, 366, sceneHeight, 18, new Color(255, 249, 244, 255), new Color(226, 214, 225, 255), 3, false);
          this.createTileBackdrop(this.sceneCard, 338, sceneHeight - 26);
          var levelPill = this.addPanel(this.canvasNode, 'LevelPill', 0, y(382, 307), 78, 34, 17, new Color(62, 59, 79, 205));
          this.levelLabel = this.addLabel(levelPill, '关卡 12', 0, 0, 14, Color.WHITE, 70, true);
          var settingsControl = this.createControlButton('SettingsButton', '菜单', -154, y(382, 307));
          this.settingsButton = settingsControl.button;
          this.settingsButtonOpacity = settingsControl.opacity;
          settingsControl.node.on(Button.EventType.CLICK, function () {
            return _this3.openSettings();
          }, this);
          var undoControl = this.createControlButton('UndoButton', '撤销', 108, y(382, 307));
          this.undoButton = undoControl.button;
          this.undoButtonOpacity = undoControl.opacity;
          undoControl.node.on(Button.EventType.CLICK, function () {
            return _this3.undoLastMove();
          }, this);
          var restartControl = this.createControlButton('RestartButton', '重玩', 158, y(382, 307));
          this.restartButton = restartControl.button;
          this.restartButtonOpacity = restartControl.opacity;
          restartControl.node.on(Button.EventType.CLICK, function () {
            return _this3.restartLevel();
          }, this);
          this.addPanel(this.canvasNode, 'ProgressTrack', 0, y(350, 278), 214, 10, 5, new Color(58, 72, 103, 82));
          this.progressFill = this.addPanel(this.canvasNode, 'ProgressFill', 0, y(350, 278), 208, 7, 3.5, new Color(255, 211, 92, 255));
          this.progressFill.setScale(0, 1, 1);
          this.progressLabel = this.addLabel(this.canvasNode, '救援 0%', 0, y(332, 262), 12, new Color(255, 255, 255, 235), 110, true);
          this.statusToast = this.addOutlinedPanel(this.canvasNode, 'StatusToast', 0, y(-163, -132), 252, 30, 15, new Color(67, 64, 94, 238), new Color(255, 241, 164, 210), 1.5, false);
          this.status = this.addLabel(this.statusToast, '正在准备兔兔…', 0, 0, 12, Color.WHITE, 228, true);
          this.statusToastOpacity = this.statusToast.addComponent(UIOpacity);
          this.addPanel(this.canvasNode, 'SlotShelf', 0, y(-86, -74), 368, 92, 26, new Color(139, 139, 171, 255));
          this.slotPositions.forEach(function (position, index) {
            var slot = _this3.addOutlinedPanel(_this3.canvasNode, "PaintSlot" + index, position.x, position.y, 58, 66, 15, new Color(115, 109, 145, 70), new Color(238, 237, 248, 175), 2, true);
            _this3.slotNodes[index] = slot;
            _this3.slotLabels[index] = _this3.addLabel(slot, '', 0, 0, 11, new Color(255, 255, 255, 0), 50, true);
          });
          [-132, -44, 44, 132].forEach(function (x, index) {
            _this3.addPanel(_this3.canvasNode, "QueueLane" + index, x, y(-310, -246), 72, _this3.compactLayout ? 190 : 210, 22, new Color(71, 69, 111, 72));
            var arrow = new Node("QueueArrow" + index);
            arrow.layer = Layers.Enum.UI_2D;
            arrow.setPosition(x, y(-215, -157), 0);
            _this3.canvasNode.addChild(arrow);
            arrow.addComponent(UITransform).setContentSize(20, 12);
            var arrowGraphics = arrow.addComponent(Graphics);
            arrowGraphics.fillColor = new Color(255, 239, 128, 230);
            arrowGraphics.moveTo(0, 6);
            arrowGraphics.lineTo(8, -5);
            arrowGraphics.lineTo(-8, -5);
            arrowGraphics.close();
            arrowGraphics.fill();
          });
          this.resultScrim = this.addPanel(this.canvasNode, 'ResultScrim', 0, 0, 390, this.designHeight, 0, new Color(42, 38, 70, 118));
          this.resultScrim.active = false;
          this.resultBanner = this.addOutlinedPanel(this.canvasNode, 'ResultBanner', 0, y(42, 30), 320, 166, 24, new Color(255, 252, 247, 252), new Color(222, 204, 230, 255), 3, false);
          this.resultTitle = this.addLabel(this.resultBanner, '完成！', 0, 48, 22, new Color(70, 60, 105, 255), 276, true);
          this.resultDetail = this.addLabel(this.resultBanner, '兔兔完成', 0, 20, 13, new Color(119, 111, 143, 255), 276);
          var resultPrimary = this.createActionButton(this.resultBanner, 'ResultPrimaryButton', '下一只动物', -70, -42, 126, new Color(109, 85, 190, 255), new Color(78, 60, 151, 255), Color.WHITE);
          this.resultPrimaryButton = resultPrimary.button;
          this.resultPrimaryLabel = resultPrimary.label;
          resultPrimary.node.on(Button.EventType.CLICK, function () {
            return _this3.handleResultPrimary();
          }, this);
          var resultSecondary = this.createActionButton(this.resultBanner, 'ResultSecondaryButton', '再玩一次', 70, -42, 126, new Color(255, 240, 224, 255), new Color(218, 174, 151, 255), new Color(114, 78, 84, 255));
          this.resultSecondaryButton = resultSecondary.button;
          this.resultSecondaryLabel = resultSecondary.label;
          resultSecondary.node.on(Button.EventType.CLICK, function () {
            return _this3.handleResultSecondary();
          }, this);
          this.resultBanner.active = false;
          this.settingsScrim = this.addPanel(this.canvasNode, 'SettingsScrim', 0, 0, 390, this.designHeight, 0, new Color(42, 38, 70, 118));
          this.settingsScrim.active = false;
          this.settingsPanel = this.addOutlinedPanel(this.canvasNode, 'SettingsPanel', 0, y(38, 28), 310, 252, 24, new Color(255, 252, 247, 255), new Color(222, 204, 230, 255), 3, false);
          this.addLabel(this.settingsPanel, '暂停一下', 0, 92, 22, new Color(70, 60, 105, 255), 270, true);
          this.addLabel(this.settingsPanel, '声音和震动可以随时调整', 0, 64, 12, new Color(119, 111, 143, 255), 270);
          this.addLabel(this.settingsPanel, '键盘 1–4 选车 · U 撤销 · R 重玩', 0, 47, 10, new Color(139, 130, 160, 255), 270);
          var soundToggle = this.createActionButton(this.settingsPanel, 'SoundToggleButton', this.soundEnabled ? '音效  开' : '音效  关', 0, 21, 242, new Color(244, 235, 255, 255), new Color(189, 164, 221, 255), new Color(82, 66, 126, 255));
          this.soundToggleLabel = soundToggle.label;
          soundToggle.node.on(Button.EventType.CLICK, function () {
            return _this3.toggleSound();
          }, this);
          var hapticsToggle = this.createActionButton(this.settingsPanel, 'HapticsToggleButton', this.hapticsEnabled ? '震动  开' : '震动  关', 0, -33, 242, new Color(244, 235, 255, 255), new Color(189, 164, 221, 255), new Color(82, 66, 126, 255));
          this.hapticsToggleLabel = hapticsToggle.label;
          hapticsToggle.node.on(Button.EventType.CLICK, function () {
            return _this3.toggleHaptics();
          }, this);
          var continueButton = this.createActionButton(this.settingsPanel, 'ContinueButton', '继续游戏', 0, -88, 242, new Color(109, 85, 190, 255), new Color(78, 60, 151, 255), Color.WHITE);
          continueButton.node.on(Button.EventType.CLICK, function () {
            return _this3.closeSettings();
          }, this);
          this.settingsPanel.active = false;
          this.updateControlButtons();
        };
        _proto.createTileBackdrop = function createTileBackdrop(parent, width, height) {
          var node = new Node('PixelTileBackdrop');
          node.layer = Layers.Enum.UI_2D;
          parent.addChild(node);
          node.addComponent(UITransform).setContentSize(width, height);
          var graphics = node.addComponent(Graphics);
          // 背景不使用与彩壳相同的像素块语言，避免装饰被误认为可解除区域。
          graphics.fillColor = new Color(225, 239, 241, 255);
          graphics.roundRect(-width / 2, -height / 2, width, height, 12);
          graphics.fill();
          graphics.lineWidth = 2;
          graphics.strokeColor = new Color(194, 218, 221, 255);
          graphics.roundRect(-width / 2 + 1, -height / 2 + 1, width - 2, height - 2, 11);
          graphics.stroke();
        };
        _proto.createBlueprint = function createBlueprint() {
          this.blockAnimal = new Node('BlockAnimal');
          this.blockAnimal.layer = Layers.Enum.UI_2D;
          this.canvasNode.addChild(this.blockAnimal);
          this.blockAnimal.addComponent(UITransform).setContentSize(340, this.compactLayout ? 282 : 324);
          this.blockAnimal.addComponent(UIOpacity);
          this.boardGraphics = this.blockAnimal.addComponent(Graphics);
          this.buildCurrentLevelBlueprint();
        };
        _proto.buildCurrentLevelBlueprint = function buildCurrentLevelBlueprint() {
          var _this4 = this;
          var animalLayout = this.createAnimalLayout(this.currentLevel.id);
          var key = function key(column, row) {
            return column + ":" + row;
          };
          var directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
          var animalByKey = new Map(animalLayout.map(function (entry) {
            return [key(entry.column, entry.row), entry];
          }));
          var animalKeys = new Set(animalByKey.keys());
          var layout = [];
          var _loop = function _loop(row) {
            var _loop2 = function _loop2(_column) {
              var animal = animalByKey.get(key(_column, row));
              var boundary = Boolean(animal) && directions.some(function (_ref) {
                var dx = _ref[0],
                  dy = _ref[1];
                return !animalKeys.has(key(_column + dx, row + dy));
              });
              var paintId = !animal ? 'oat' : animal.feature === 'cocoa' || animal.feature === 'blush' ? animal.feature : boundary ? 'cream' : 'ivory';
              layout.push({
                row: row,
                column: _column,
                paintId: paintId,
                boundary: boundary
              });
            };
            for (var _column = _this4.boardMinColumn; _column <= _this4.boardMaxColumn; _column += 1) {
              _loop2(_column);
            }
          };
          for (var row = this.boardMinRow; row <= this.boardMaxRow; row += 1) {
            _loop(row);
          }
          this.totalRows = this.boardMaxRow - this.boardMinRow + 1;
          this.paintDefinitions.forEach(function (definition) {
            definition.total = layout.filter(function (entry) {
              return entry.paintId === definition.id;
            }).length;
          });
          this.configurePaintBatchPlans();
          this.paintDefinitions.forEach(function (definition) {
            var plannedTotal = _this4.paintBatchPlans.filter(function (plan) {
              return plan.paintId === definition.id;
            }).reduce(function (sum, plan) {
              return sum + plan.amount;
            }, 0);
            if (plannedTotal !== definition.total) {
              throw new Error("Paint batch mismatch for " + definition.id + ": blueprint=" + definition.total + ", batches=" + plannedTotal);
            }
          });
          var baseY = this.compactLayout ? -10 : 0;
          var pitch = this.compactLayout ? 11.8 : 14;
          var blockSize = pitch + 0.16;
          this.boardBaseY = baseY;
          this.boardPitch = pitch;
          this.blockVisualSize = blockSize;
          this.cells = layout.map(function (entry) {
            return {
              row: entry.row,
              column: entry.column,
              paintId: entry.paintId,
              position: new Vec3(entry.column * pitch, baseY + (entry.row - _this4.boardMinRow) * pitch, 0),
              boundary: entry.boundary,
              completed: false
            };
          });
          this.revealMilestone = 0;
          this.updateBlueprintPreview(false);
        };
        _proto.createAnimalLayout = function createAnimalLayout(animalId) {
          var animalLayout = [];
          var addRow = function addRow(row, columns, colorAt) {
            columns.forEach(function (column) {
              return animalLayout.push({
                row: row,
                column: column,
                feature: colorAt(column)
              });
            });
          };
          var range = function range(from, to) {
            return Array.from({
              length: to - from + 1
            }, function (_, index) {
              return from + index;
            });
          };
          if (animalId === 'kitten') {
            // 猫咪：尖耳、圆脸、坐姿和右侧卷尾，轮廓与兔兔一眼可区分。
            addRow(0, [].concat(range(-6, -3), range(3, 6)), function () {
              return 'ivory';
            });
            addRow(1, range(-6, 6), function () {
              return 'ivory';
            });
            [2, 3, 4, 5, 6].forEach(function (row) {
              return addRow(row, range(-5, 5), function () {
                return 'ivory';
              });
            });
            addRow(3, [6, 7], function () {
              return 'ivory';
            });
            [4, 5].forEach(function (row) {
              return addRow(row, [6, 7, 8], function () {
                return 'ivory';
              });
            });
            addRow(6, [6, 7], function () {
              return 'ivory';
            });
            addRow(7, range(-4, 6), function () {
              return 'ivory';
            });
            [8, 9, 10, 11].forEach(function (row) {
              return addRow(row, range(-4, 4), function () {
                return 'ivory';
              });
            });
            addRow(12, range(-5, 5), function (column) {
              return column === 0 ? 'cocoa' : 'ivory';
            });
            addRow(13, range(-6, 6), function (column) {
              return Math.abs(column) === 5 ? 'blush' : column === 0 ? 'cocoa' : 'ivory';
            });
            addRow(14, range(-6, 6), function (column) {
              return [-3, 3].includes(column) ? 'cocoa' : 'ivory';
            });
            addRow(15, range(-6, 6), function (column) {
              return [-3, 3].includes(column) ? 'cocoa' : 'ivory';
            });
            addRow(16, range(-6, 6), function () {
              return 'ivory';
            });
            addRow(17, range(-6, 6), function () {
              return 'ivory';
            });
            addRow(18, [].concat(range(-6, -2), range(2, 6)), function (column) {
              return Math.abs(column) === 4 ? 'blush' : 'ivory';
            });
            addRow(19, [].concat(range(-6, -3), range(3, 6)), function (column) {
              return Math.abs(column) === 4 ? 'blush' : 'ivory';
            });
            addRow(20, [].concat(range(-5, -4), range(4, 5)), function () {
              return 'ivory';
            });
            return animalLayout;
          }

          // 先保留兔子的像素轮廓，再把整个棋盘补满；外部背景与动物色带都是真实可上车方块。
          addRow(0, [-6, -5, -4, -3, 3, 4, 5, 6], function (column) {
            return Math.abs(column) >= 5 ? 'oat' : 'ivory';
          });
          addRow(1, [-6, -5, -4, -3, -2, 2, 3, 4, 5, 6], function (column) {
            return Math.abs(column) >= 5 ? 'oat' : 'ivory';
          });
          [2, 3, 4].forEach(function (row) {
            addRow(row, range(-5, 5), function (column) {
              return Math.abs(column) <= 2 ? 'ivory' : 'cream';
            });
          });
          [5, 6, 7, 8].forEach(function (row) {
            addRow(row, range(-4, 4), function (column) {
              return Math.abs(column) === 4 ? 'oat' : 'cream';
            });
          });

          // 脸部不再用一大块符号色：可可棕对应嘴、双眼和眉毛。
          addRow(9, range(-5, 5), function (column) {
            return column === 0 ? 'cocoa' : 'cream';
          });
          [10, 11].forEach(function (row) {
            addRow(row, range(-5, 5), function (column) {
              return [-3, -2, 2, 3].includes(column) ? 'cocoa' : 'cream';
            });
          });
          addRow(12, range(-4, 4), function (column) {
            return [-2, 2].includes(column) ? 'cocoa' : 'cream';
          });

          // 耳朵粉只出现在长耳内侧，其余仍是兔毛奶油杏。
          addRow(13, range(-5, 5), function (column) {
            return Math.abs(column) === 4 ? 'blush' : 'cream';
          });
          addRow(14, [-5, -4, -3, -1, 0, 1, 3, 4, 5], function (column) {
            return Math.abs(column) === 4 ? 'blush' : 'cream';
          });
          [15, 16].forEach(function (row) {
            addRow(row, [-5, -4, -3, 3, 4, 5], function (column) {
              return Math.abs(column) === 4 ? 'blush' : 'cream';
            });
          });
          addRow(17, [-5, -4, 4, 5], function (column) {
            return Math.abs(column) === 4 ? 'blush' : 'cream';
          });
          addRow(18, [-4, -3, 3, 4], function (column) {
            return Math.abs(column) === 3 ? 'blush' : 'cream';
          });
          return animalLayout;
        };
        _proto.configurePaintBatchPlans = function configurePaintBatchPlans() {
          var _this5 = this;
          var split = function split(paintId) {
            var total = _this5.getDefinition(paintId).total;
            return [Math.ceil(total / 2), Math.floor(total / 2)];
          };
          var _split = split('oat'),
            oatA = _split[0],
            oatB = _split[1];
          var _split2 = split('ivory'),
            ivoryA = _split2[0],
            ivoryB = _split2[1];
          var _split3 = split('cream'),
            creamA = _split3[0],
            creamB = _split3[1];
          var _split4 = split('cocoa'),
            cocoaA = _split4[0],
            cocoaB = _split4[1];
          var _split5 = split('blush'),
            blushA = _split5[0],
            blushB = _split5[1];
          this.paintBatchPlans = [{
            paintId: 'oat',
            amount: oatA,
            columnIndex: 0,
            depthIndex: 0
          }, {
            paintId: 'ivory',
            amount: ivoryA,
            columnIndex: 0,
            depthIndex: 1
          }, {
            paintId: 'cream',
            amount: creamA,
            columnIndex: 0,
            depthIndex: 2
          }, {
            paintId: 'ivory',
            amount: ivoryB,
            columnIndex: 1,
            depthIndex: 0
          }, {
            paintId: 'cocoa',
            amount: cocoaA,
            columnIndex: 1,
            depthIndex: 1
          }, {
            paintId: 'blush',
            amount: blushA,
            columnIndex: 1,
            depthIndex: 2
          }, {
            paintId: 'oat',
            amount: oatB,
            columnIndex: 2,
            depthIndex: 0
          }, {
            paintId: 'cream',
            amount: creamB,
            columnIndex: 2,
            depthIndex: 1
          }, {
            paintId: 'cocoa',
            amount: cocoaB,
            columnIndex: 3,
            depthIndex: 0
          }, {
            paintId: 'blush',
            amount: blushB,
            columnIndex: 3,
            depthIndex: 1
          }].filter(function (plan) {
            return plan.amount > 0;
          });
        };
        _proto.createPaintTrays = function createPaintTrays() {
          var _this6 = this;
          this.trays.forEach(function (tray) {
            Tween.stopAllByTarget(tray.node);
            Tween.stopAllByTarget(tray.opacity);
            if (tray.node.isValid) tray.node.destroy();
          });
          this.trays = [];
          this.activeSlots = Array(5).fill(null);
          this.paintBatchPlans.forEach(function (plan, index) {
            var definition = _this6.getDefinition(plan.paintId);
            var home = _this6.getQueuePosition(plan.columnIndex, plan.depthIndex);
            var node = _this6.createPaintTrayNode(definition, home, plan.amount, index);
            var button = node.addComponent(Button);
            var opacity = node.addComponent(UIOpacity);
            var countLabel = node.getChildByName('CountPanel').getChildByName('Count').getComponent(Label);
            var tray = {
              definition: definition,
              capacity: plan.amount,
              node: node,
              button: button,
              opacity: opacity,
              countLabel: countLabel,
              home: home.clone(),
              remaining: plan.amount,
              selected: false,
              parked: false,
              slotIndex: -1,
              columnIndex: plan.columnIndex,
              depthIndex: plan.depthIndex
            };
            node.on(Button.EventType.CLICK, function () {
              return _this6.selectTray(tray);
            }, _this6);
            _this6.trays.push(tray);
          });
          this.refreshQueueTrays(false);
        };
        _proto.getQueuePosition = function getQueuePosition(columnIndex, queueRank) {
          var columns = [-132, -44, 44, 132];
          var frontY = this.compactLayout ? -196 : -238;
          var gap = this.compactLayout ? 54 : 66;
          return new Vec3(columns[columnIndex], frontY - queueRank * gap, 0);
        };
        _proto.isQueueFront = function isQueueFront(tray) {
          if (tray.selected || tray.remaining <= 0) return false;
          return !this.trays.some(function (other) {
            return other.columnIndex === tray.columnIndex && other.depthIndex < tray.depthIndex && !other.selected && other.remaining > 0;
          });
        };
        _proto.refreshQueueTrays = function refreshQueueTrays(animated) {
          var _this7 = this;
          var _loop3 = function _loop3(columnIndex) {
            var pending = _this7.trays.filter(function (tray) {
              return tray.columnIndex === columnIndex && !tray.selected && tray.remaining > 0;
            }).sort(function (a, b) {
              return a.depthIndex - b.depthIndex;
            });
            pending.forEach(function (tray, queueRank) {
              var home = _this7.getQueuePosition(columnIndex, queueRank);
              tray.home = home.clone();
              tray.node.active = true;
              Tween.stopAllByTarget(tray.node);
              Tween.stopAllByTarget(tray.opacity);
              var targetScale = queueRank === 0 ? Vec3.ONE : new Vec3(0.92, 0.92, 1);
              var targetOpacity = queueRank === 0 ? 255 : queueRank === 1 ? 178 : 108;
              if (animated) {
                tween(tray.node).to(0.22, {
                  position: home,
                  scale: targetScale
                }, {
                  easing: 'quadOut'
                }).start();
                tween(tray.opacity).to(0.18, {
                  opacity: targetOpacity
                }).start();
              } else {
                tray.node.setPosition(home);
                tray.node.setScale(targetScale);
                tray.opacity.opacity = targetOpacity;
              }
            });
          };
          for (var columnIndex = 0; columnIndex < 4; columnIndex += 1) {
            _loop3(columnIndex);
          }
        };
        _proto.loadFinalAnimal = function loadFinalAnimal() {
          var _this8 = this;
          var frameNames = ['normal', 'blink', 'joy'];
          Promise.all(this.animalLevels.flatMap(function (level) {
            return frameNames.map(function (name) {
              return _this8.loadSequenceFrame(level, name);
            });
          })).then(function (frames) {
            _this8.animalLevels.forEach(function (level, levelIndex) {
              var offset = levelIndex * frameNames.length;
              _this8.animalFrames.set(level.id, {
                normal: frames[offset],
                blink: frames[offset + 1],
                joy: frames[offset + 2]
              });
            });
            _this8.finalAnimalFrames = _this8.animalFrames.get(_this8.currentLevel.id);
            var animalWidth = _this8.compactLayout ? 170 : 205;
            var animalHeight = _this8.compactLayout ? 255 : 308;
            var animalY = _this8.compactLayout ? 112 : 145;
            _this8.guideAnimal = new Node('BackgroundAnimalGuide');
            _this8.guideAnimal.layer = Layers.Enum.UI_2D;
            _this8.guideAnimal.setPosition(0, animalY, 0);
            _this8.guideAnimal.addComponent(UITransform).setContentSize(animalWidth, animalHeight);
            _this8.canvasNode.addChild(_this8.guideAnimal);
            _this8.guideAnimalSprite = _this8.guideAnimal.addComponent(Sprite);
            _this8.guideAnimalSprite.sizeMode = Sprite.SizeMode.CUSTOM;
            _this8.guideAnimalSprite.spriteFrame = _this8.finalAnimalFrames.normal;
            _this8.guideAnimalSprite.color = new Color(235, 220, 207, 255);
            _this8.guideAnimalOpacity = _this8.guideAnimal.addComponent(UIOpacity);
            _this8.guideAnimalOpacity.opacity = 0;
            _this8.guideAnimal.setSiblingIndex(_this8.blockAnimal.getSiblingIndex());
            _this8.finalAnimal = new Node('FullFrameCuteAnimal');
            _this8.finalAnimal.layer = Layers.Enum.UI_2D;
            _this8.finalAnimal.setPosition(0, animalY, 0);
            _this8.finalAnimal.addComponent(UITransform).setContentSize(animalWidth, animalHeight);
            _this8.canvasNode.addChild(_this8.finalAnimal);
            _this8.finalAnimalSprite = _this8.finalAnimal.addComponent(Sprite);
            _this8.finalAnimalSprite.sizeMode = Sprite.SizeMode.CUSTOM;
            _this8.finalAnimalSprite.spriteFrame = _this8.finalAnimalFrames.normal;
            _this8.finalAnimalOpacity = _this8.finalAnimal.addComponent(UIOpacity);
            _this8.finalAnimalOpacity.opacity = 0;
            _this8.finalAnimal.active = false;
            _this8.finalAnimal.setSiblingIndex(_this8.blockAnimal.getSiblingIndex());
            _this8.applyCurrentAnimalFrames();
            _this8.finalAnimal.active = true;
            _this8.finalAnimalOpacity.opacity = 255;
            _this8.showStatus('点击下方队首颜色车', 4.2);
            _this8.setAutomationStatus('ready');
            _this8.updateControlButtons();
          })["catch"](function (error) {
            _this8.showStatus('小动物没有准备好，请重新加载', 0);
            _this8.setAutomationStatus('asset-error');
            console.error('[T1-PaintBuild] Failed to load full-frame animal sequence', error);
          });
        };
        _proto.loadSequenceFrame = function loadSequenceFrame(level, name) {
          return new Promise(function (resolve, reject) {
            resources.load("characters/" + level.resourceDir + "/" + name + "/spriteFrame", SpriteFrame, function (error, frame) {
              if (error || !frame) {
                reject(error != null ? error : new Error("Missing full-frame sequence asset: " + level.id + "/" + name));
                return;
              }
              resolve(frame);
            });
          });
        };
        _proto.applyCurrentAnimalFrames = function applyCurrentAnimalFrames() {
          var frames = this.animalFrames.get(this.currentLevel.id);
          if (!frames || !this.finalAnimalSprite || !this.guideAnimalSprite) return;
          this.finalAnimalFrames = frames;
          this.finalAnimalSprite.spriteFrame = frames.normal;
          this.guideAnimalSprite.spriteFrame = frames.normal;
          this.guideAnimal.name = "Background" + this.currentLevel.id + "Guide";
          this.finalAnimal.name = "FullFrameCute" + this.currentLevel.id;
          this.levelLabel.string = "\u5173\u5361 " + this.currentLevel.levelNumber;
        };
        _proto.loadAudio = function loadAudio() {
          var _this9 = this;
          var soundIds = ['select', 'land', 'layer', 'success', 'fail'];
          soundIds.forEach(function (soundId) {
            resources.load("audio/vertical-slice/" + soundId, AudioClip, function (error, clip) {
              if (error || !clip) {
                console.warn("[T1-PaintBuild] Optional audio cue failed to load: " + soundId, error);
                return;
              }
              _this9.audioClips.set(soundId, clip);
            });
          });
        };
        _proto.loadPreferences = function loadPreferences() {
          if (typeof localStorage === 'undefined') return;
          try {
            var _localStorage$getItem;
            var stored = JSON.parse((_localStorage$getItem = localStorage.getItem('animal-rescue-preferences-v1')) != null ? _localStorage$getItem : '{}');
            if (typeof stored.soundEnabled === 'boolean') this.soundEnabled = stored.soundEnabled;
            if (typeof stored.hapticsEnabled === 'boolean') this.hapticsEnabled = stored.hapticsEnabled;
          } catch (_unused) {
            this.soundEnabled = true;
            this.hapticsEnabled = true;
          }
        };
        _proto.persistPreferences = function persistPreferences() {
          if (typeof localStorage === 'undefined') return;
          try {
            localStorage.setItem('animal-rescue-preferences-v1', JSON.stringify({
              soundEnabled: this.soundEnabled,
              hapticsEnabled: this.hapticsEnabled
            }));
          } catch (_unused2) {
            // 浏览器禁用存储时仍保持当前会话设置，不阻断游戏。
          }
        };
        _proto.showStatus = function showStatus(message, duration) {
          var _this10 = this;
          if (duration === void 0) {
            duration = 2;
          }
          if (!this.statusToast || !this.statusToastOpacity) return;
          this.statusEpoch += 1;
          var epoch = this.statusEpoch;
          this.status.string = message;
          if (typeof document !== 'undefined') {
            var liveRegion = document.getElementById('animal-rescue-live');
            if (liveRegion) liveRegion.textContent = message;
          }
          this.statusToast.active = true;
          this.statusToast.setSiblingIndex(this.canvasNode.children.length - 1);
          Tween.stopAllByTarget(this.statusToastOpacity);
          this.statusToastOpacity.opacity = 255;
          if (duration <= 0) return;
          this.scheduleOnce(function () {
            if (epoch !== _this10.statusEpoch || !_this10.statusToast.active) return;
            tween(_this10.statusToastOpacity).to(0.2, {
              opacity: 0
            }, {
              easing: 'quadOut'
            }).call(function () {
              if (epoch === _this10.statusEpoch) _this10.statusToast.active = false;
            }).start();
          }, duration);
        };
        _proto.setupKeyboardControls = function setupKeyboardControls() {
          var _this11 = this;
          if (typeof window === 'undefined') return;
          this.keyboardHandler = function (event) {
            var _this11$settingsPanel;
            if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return;
            if (event.key === 'Escape' && (_this11$settingsPanel = _this11.settingsPanel) != null && _this11$settingsPanel.active) {
              _this11.closeSettings();
              return;
            }
            if (event.key.toLowerCase() === 'u') {
              _this11.undoLastMove();
              return;
            }
            if (event.key.toLowerCase() === 'r') {
              _this11.restartLevel();
              return;
            }
            var columnIndex = Number(event.key) - 1;
            if (columnIndex < 0 || columnIndex > 3) return;
            var frontTray = _this11.trays.find(function (tray) {
              return tray.columnIndex === columnIndex && _this11.isQueueFront(tray);
            });
            if (frontTray) void _this11.selectTray(frontTray);
          };
          window.addEventListener('keydown', this.keyboardHandler);
        };
        _proto.onDestroy = function onDestroy() {
          if (this.keyboardHandler && typeof window !== 'undefined') {
            window.removeEventListener('keydown', this.keyboardHandler);
          }
        };
        _proto.playHaptic = function playHaptic(pattern) {
          if (!this.hapticsEnabled || typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
          navigator.vibrate(pattern);
        };
        _proto.openSettings = function openSettings() {
          if (this.gamePaused || this.resolving || this.movingCarCount > 0 || this.resultBanner.active) return;
          this.gamePaused = true;
          this.soundToggleLabel.string = this.soundEnabled ? '音效  开' : '音效  关';
          this.hapticsToggleLabel.string = this.hapticsEnabled ? '震动  开' : '震动  关';
          this.settingsScrim.active = true;
          this.settingsPanel.active = true;
          this.settingsScrim.setSiblingIndex(this.canvasNode.children.length - 2);
          this.settingsPanel.setSiblingIndex(this.canvasNode.children.length - 1);
          this.settingsPanel.setScale(0.9, 0.9, 1);
          tween(this.settingsPanel).to(0.2, {
            scale: Vec3.ONE
          }, {
            easing: 'backOut'
          }).start();
          this.playSound('select', 0.32);
          this.playHaptic(6);
          this.updateControlButtons();
        };
        _proto.closeSettings = function closeSettings(playCue) {
          if (playCue === void 0) {
            playCue = true;
          }
          if (!this.settingsPanel) return;
          Tween.stopAllByTarget(this.settingsPanel);
          this.settingsPanel.active = false;
          this.settingsScrim.active = false;
          this.gamePaused = false;
          if (playCue) this.playSound('select', 0.28);
          this.updateControlButtons();
        };
        _proto.toggleSound = function toggleSound() {
          this.soundEnabled = !this.soundEnabled;
          this.soundToggleLabel.string = this.soundEnabled ? '音效  开' : '音效  关';
          this.persistPreferences();
          if (this.soundEnabled) this.playSound('select', 0.34);
          this.updateAutomationMetrics();
        };
        _proto.toggleHaptics = function toggleHaptics() {
          this.hapticsEnabled = !this.hapticsEnabled;
          this.hapticsToggleLabel.string = this.hapticsEnabled ? '震动  开' : '震动  关';
          this.persistPreferences();
          if (this.hapticsEnabled) this.playHaptic(10);
          this.updateAutomationMetrics();
        };
        _proto.playSound = function playSound(soundId, volume) {
          var _this$soundPlayedAt$g;
          if (volume === void 0) {
            volume = 0.6;
          }
          if (!this.soundEnabled) return;
          var clip = this.audioClips.get(soundId);
          if (!clip || !this.audioSource) return;
          var now = Date.now();
          var minimumGap = soundId === 'select' ? 240 : soundId === 'land' ? 60 : soundId === 'layer' ? 90 : 0;
          if (now - ((_this$soundPlayedAt$g = this.soundPlayedAt.get(soundId)) != null ? _this$soundPlayedAt$g : 0) < minimumGap) return;
          this.soundPlayedAt.set(soundId, now);
          this.audioSource.playOneShot(clip, volume);
        };
        _proto.selectTray = /*#__PURE__*/function () {
          var _selectTray = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(tray) {
            var slotIndex;
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  if (!(this.gamePaused || this.terminal || tray.selected || !this.finalAnimal || !this.isQueueFront(tray))) {
                    _context.next = 2;
                    break;
                  }
                  return _context.abrupt("return");
                case 2:
                  slotIndex = this.activeSlots.findIndex(function (active) {
                    return active === null;
                  });
                  if (!(slotIndex < 0)) {
                    _context.next = 5;
                    break;
                  }
                  return _context.abrupt("return");
                case 5:
                  this.history.push(this.captureSnapshot());
                  tray.selected = true;
                  tray.parked = false;
                  tray.slotIndex = slotIndex;
                  tray.button.interactable = false;
                  this.activeSlots[slotIndex] = tray;
                  this.movingCarCount += 1;
                  this.refreshQueueTrays(true);
                  this.updateSlotLabels();
                  this.updateControlButtons();
                  this.setAutomationStatus('running');
                  this.showStatus(tray.definition.name + "\u8F66\u8FDB\u5165\u505C\u8F66\u4F4D", 1.6);
                  this.playSound('select', 0.52);
                  this.playHaptic(8);
                  Tween.stopAllByTarget(tray.node);
                  tween(tray.node).to(0.08, {
                    scale: new Vec3(0.94, 1.06, 1)
                  }, {
                    easing: 'quadOut'
                  }).to(0.22, {
                    position: this.slotPositions[slotIndex],
                    scale: new Vec3(0.92, 0.92, 1)
                  }, {
                    easing: 'quadOut'
                  }).start();
                  _context.next = 23;
                  return this.wait(0.32);
                case 23:
                  this.movingCarCount = Math.max(0, this.movingCarCount - 1);
                  if (!(this.terminal || !tray.selected || tray.slotIndex !== slotIndex || this.activeSlots[slotIndex] !== tray)) {
                    _context.next = 27;
                    break;
                  }
                  this.updateControlButtons();
                  return _context.abrupt("return");
                case 27:
                  tray.parked = true;
                  this.updateControlButtons();
                  _context.next = 31;
                  return this.resolveAvailableCells();
                case 31:
                case "end":
                  return _context.stop();
              }
            }, _callee, this);
          }));
          function selectTray(_x) {
            return _selectTray.apply(this, arguments);
          }
          return selectTray;
        }();
        _proto.resolveAvailableCells = /*#__PURE__*/function () {
          var _resolveAvailableCells = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
            var _this12 = this;
            var jobs, workingTrays, workingNames, walking, neededNames, hasQueueChoice;
            return _regeneratorRuntime().wrap(function _callee2$(_context2) {
              while (1) switch (_context2.prev = _context2.next) {
                case 0:
                  this.resolveRequested = true;
                  if (!(this.resolving || this.terminal)) {
                    _context2.next = 3;
                    break;
                  }
                  return _context2.abrupt("return");
                case 3:
                  this.resolving = true;
                case 4:
                  if (this.terminal) {
                    _context2.next = 38;
                    break;
                  }
                  this.resolveRequested = false;
                  if (this.cells.some(function (cell) {
                    return !cell.completed;
                  })) {
                    _context2.next = 11;
                    break;
                  }
                  this.resolving = false;
                  _context2.next = 10;
                  return this.completeAnimal();
                case 10:
                  return _context2.abrupt("return");
                case 11:
                  jobs = this.allocateExposedJobs();
                  if (!(jobs.length === 0)) {
                    _context2.next = 14;
                    break;
                  }
                  return _context2.abrupt("break", 38);
                case 14:
                  workingTrays = Array.from(new Set(jobs.map(function (job) {
                    return job.tray;
                  })));
                  this.workingSlotCount = workingTrays.length;
                  this.updateAutomationMetrics();
                  workingNames = workingTrays.map(function (tray) {
                    return tray.definition.name;
                  }).join('＋');
                  this.status.string = workingTrays.length > 1 ? workingNames + "\u5C0F\u65B9\u5757\u540C\u65F6\u4E0A\u8F66" : workingNames + "\u5C0F\u65B9\u5757\u6B63\u5728\u4E0A\u8F66";

                  // 先锁定本批逻辑状态，再播放步行动画；这样动画期间新车也能安全进入其他空位。
                  walking = jobs.map(function (job, index) {
                    return _this12.walkShellBlockToCar(job.tray, job.cell, index * 0.014, index % 4 === 0);
                  });
                  jobs.forEach(function (_ref2) {
                    var cell = _ref2.cell,
                      tray = _ref2.tray;
                    cell.completed = true;
                    tray.remaining -= 1;
                    tray.countLabel.string = String(tray.remaining);
                  });
                  this.updateBlueprintPreview();
                  this.updateControlButtons();
                  _context2.next = 25;
                  return Promise.all(walking);
                case 25:
                  this.landedSoundCounter += jobs.length;
                  workingTrays.forEach(function (_, index) {
                    return _this12.playSound('land', index === 0 ? 0.22 : 0.16);
                  });
                  this.updateSlotLabels();
                  _context2.next = 30;
                  return this.wait(0.08);
                case 30:
                  _context2.next = 32;
                  return this.celebrateOpenedPaths(jobs);
                case 32:
                  _context2.next = 34;
                  return Promise.all(workingTrays.filter(function (tray) {
                    return tray.remaining === 0;
                  }).map(function (tray) {
                    return _this12.releaseTray(tray);
                  }));
                case 34:
                  _context2.next = 36;
                  return this.wait(0.045);
                case 36:
                  _context2.next = 4;
                  break;
                case 38:
                  this.resolving = false;
                  this.workingSlotCount = 0;
                  this.updateAutomationMetrics();
                  if (this.cells.some(function (cell) {
                    return !cell.completed;
                  })) {
                    _context2.next = 45;
                    break;
                  }
                  _context2.next = 44;
                  return this.completeAnimal();
                case 44:
                  return _context2.abrupt("return");
                case 45:
                  if (!(this.movingCarCount > 0 || this.activeSlots.some(function (tray) {
                    return tray && !tray.parked;
                  }))) {
                    _context2.next = 50;
                    break;
                  }
                  this.showStatus('颜色车正在进入停车位…', 1.2);
                  this.setAutomationStatus('running');
                  this.updateControlButtons();
                  return _context2.abrupt("return");
                case 50:
                  if (!this.resolveRequested) {
                    _context2.next = 54;
                    break;
                  }
                  _context2.next = 53;
                  return this.resolveAvailableCells();
                case 53:
                  return _context2.abrupt("return");
                case 54:
                  neededNames = Array.from(new Set(this.getExposedCells().map(function (cell) {
                    return _this12.getDefinition(cell.paintId).name;
                  })));
                  hasQueueChoice = this.trays.some(function (tray) {
                    return _this12.isQueueFront(tray);
                  });
                  if (!(this.activeSlots.every(Boolean) || !hasQueueChoice)) {
                    _context2.next = 60;
                    break;
                  }
                  _context2.next = 59;
                  return this.failBuild(neededNames.join(' / '));
                case 59:
                  return _context2.abrupt("return");
                case 60:
                  this.showStatus("\u63A5\u4E0B\u6765\u9700\u8981 " + neededNames.join(' / '), 0);
                  this.setAutomationStatus('waiting');
                  this.updateControlButtons();
                case 63:
                case "end":
                  return _context2.stop();
              }
            }, _callee2, this);
          }));
          function resolveAvailableCells() {
            return _resolveAvailableCells.apply(this, arguments);
          }
          return resolveAvailableCells;
        }();
        _proto.walkShellBlockToCar = /*#__PURE__*/function () {
          var _walkShellBlockToCar = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(tray, target, delay, showLandingEffect) {
            var _this13 = this;
            return _regeneratorRuntime().wrap(function _callee3$(_context3) {
              while (1) switch (_context3.prev = _context3.next) {
                case 0:
                  if (delay === void 0) {
                    delay = 0;
                  }
                  if (showLandingEffect === void 0) {
                    showLandingEffect = false;
                  }
                  return _context3.abrupt("return", new Promise(function (resolve) {
                    var definition = _this13.getDefinition(target.paintId);
                    var walker = _this13.createSoftSquare(_this13.canvasNode, 'WalkingShellBlock', target.position.x, target.position.y, _this13.blockVisualSize * 0.74, definition.color, definition.deep);
                    _this13.drawPaintSymbol(walker.getComponent(Graphics), target.paintId, 0, 0.5, Math.max(2.1, _this13.blockVisualSize * 0.17), new Color(255, 255, 255, 220));
                    _this13.addWalkingLegs(walker, definition.deep);
                    _this13.transientNodes.push(walker);
                    var start = target.position.clone();
                    var carDoor = new Vec3(tray.node.position.x, tray.node.position.y + 6, 0);
                    var route = _this13.getWalkingRoute(target, tray);
                    var previous = start;
                    var motion = tween(walker).delay(delay);
                    route.forEach(function (point, index) {
                      var distance = Vec3.distance(previous, point);
                      var duration = Math.max(0.06, Math.min(0.2, distance / 135));
                      motion = motion.to(duration, {
                        position: point,
                        scale: index % 2 === 0 ? new Vec3(1.03, 0.97, 1) : new Vec3(0.97, 1.03, 1),
                        eulerAngles: new Vec3(0, 0, index % 2 === 0 ? -5 : 5)
                      }, {
                        easing: 'sineInOut'
                      });
                      previous = point;
                    });
                    motion.to(0.12, {
                      position: carDoor,
                      scale: new Vec3(0.74, 0.74, 1),
                      eulerAngles: Vec3.ZERO
                    }, {
                      easing: 'quadIn'
                    }).to(0.08, {
                      position: tray.node.position.clone(),
                      scale: new Vec3(0.1, 0.1, 1)
                    }, {
                      easing: 'quadIn'
                    }).call(function () {
                      if (showLandingEffect) _this13.createLandingRipple(tray.node.position, tray.definition.color);
                      walker.destroy();
                      _this13.transientNodes = _this13.transientNodes.filter(function (node) {
                        return node !== walker;
                      });
                      resolve();
                    }).start();
                  }));
                case 3:
                case "end":
                  return _context3.stop();
              }
            }, _callee3);
          }));
          function walkShellBlockToCar(_x2, _x3, _x4, _x5) {
            return _walkShellBlockToCar.apply(this, arguments);
          }
          return walkShellBlockToCar;
        }();
        _proto.getWalkingRoute = function getWalkingRoute(target, tray) {
          var _this14 = this;
          var key = function key(column, row) {
            return column + ":" + row;
          };
          var blocked = new Set(this.cells.filter(function (cell) {
            return !cell.completed && cell !== target;
          }).map(function (cell) {
            return key(cell.column, cell.row);
          }));
          var carDoor = new Vec3(tray.node.position.x, tray.node.position.y + 6, 0);
          var goalColumn = Math.round(carDoor.x / this.boardPitch);
          var goalRow = Math.round((carDoor.y - this.boardBaseY) / this.boardPitch + this.boardMinRow);
          // 把车辆入口直接放进同一张空白网格寻路，而不是先找任意出口、再固定绕到棋盘下方。
          // 因此BFS得到的是“当前方块 → 对应车辆”的全局最少网格步数；相同步数时优先向下和朝车辆方向走。
          var minColumn = Math.min(this.boardMinColumn - 2, goalColumn - 1);
          var maxColumn = Math.max(this.boardMaxColumn + 2, goalColumn + 1);
          var minRow = Math.min(this.boardMinRow - 2, goalRow - 1);
          var maxRow = Math.max(this.boardMaxRow + 2, goalRow + 1);
          var startKey = key(target.column, target.row);
          var goalKey = key(goalColumn, goalRow);
          var queue = [[target.column, target.row]];
          var visited = new Set([startKey]);
          var parent = new Map();
          var cursor = 0;
          var _loop4 = function _loop4() {
            var _queue$cursor = queue[cursor],
              column = _queue$cursor[0],
              row = _queue$cursor[1];
            cursor += 1;
            if (column === goalColumn && row === goalRow) return 1; // break
            var horizontalTowardCar = goalColumn < column ? [-1, 0] : [1, 0];
            var directions = [[0, -1], horizontalTowardCar, [-horizontalTowardCar[0], 0], [0, 1]];
            directions.forEach(function (_ref4) {
              var dx = _ref4[0],
                dy = _ref4[1];
              var nextColumn = column + dx;
              var nextRow = row + dy;
              var nextKey = key(nextColumn, nextRow);
              if (nextColumn < minColumn || nextColumn > maxColumn || nextRow < minRow || nextRow > maxRow) return;
              if (visited.has(nextKey) || blocked.has(nextKey)) return;
              visited.add(nextKey);
              parent.set(nextKey, key(column, row));
              queue.push([nextColumn, nextRow]);
            });
          };
          while (cursor < queue.length) {
            if (_loop4()) break;
          }
          if (!visited.has(goalKey)) {
            throw new Error("No empty shortest route from " + startKey + " to car " + goalKey);
          }
          var gridPath = [];
          var currentKey = goalKey;
          while (true) {
            var _currentKey$split$map = currentKey.split(':').map(Number),
              _column2 = _currentKey$split$map[0],
              row = _currentKey$split$map[1];
            gridPath.push([_column2, row]);
            if (currentKey === startKey) break;
            currentKey = parent.get(currentKey);
          }
          gridPath.reverse();
          var simplified = [gridPath[0]];
          for (var index = 1; index < gridPath.length - 1; index += 1) {
            var previous = gridPath[index - 1];
            var current = gridPath[index];
            var next = gridPath[index + 1];
            var incoming = [current[0] - previous[0], current[1] - previous[1]];
            var outgoing = [next[0] - current[0], next[1] - current[1]];
            if (incoming[0] !== outgoing[0] || incoming[1] !== outgoing[1]) simplified.push(current);
          }
          simplified.push(gridPath[gridPath.length - 1]);
          var toPosition = function toPosition(_ref3) {
            var column = _ref3[0],
              row = _ref3[1];
            return new Vec3(column * _this14.boardPitch, _this14.boardBaseY + (row - _this14.boardMinRow) * _this14.boardPitch, 0);
          };
          return simplified.slice(1).map(toPosition);
        };
        _proto.addWalkingLegs = function addWalkingLegs(walker, color) {
          var legs = new Node('TwoLittleLegs');
          legs.layer = Layers.Enum.UI_2D;
          legs.setPosition(0, -7, 0);
          walker.addChild(legs);
          legs.addComponent(UITransform).setContentSize(14, 10);
          var graphics = legs.addComponent(Graphics);
          graphics.lineWidth = 2.2;
          graphics.strokeColor = color;
          graphics.moveTo(-3, 3);
          graphics.lineTo(-4, -3);
          graphics.moveTo(3, 3);
          graphics.lineTo(4, -3);
          graphics.stroke();
          graphics.fillColor = color;
          graphics.ellipse(-5, -4, 3.5, 1.8);
          graphics.ellipse(5, -4, 3.5, 1.8);
          graphics.fill();
        };
        _proto.releaseTray = /*#__PURE__*/function () {
          var _releaseTray = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(tray) {
            var slotIndex;
            return _regeneratorRuntime().wrap(function _callee4$(_context4) {
              while (1) switch (_context4.prev = _context4.next) {
                case 0:
                  slotIndex = tray.slotIndex;
                  this.activeSlots[slotIndex] = null;
                  tray.parked = false;
                  tray.slotIndex = -1;
                  this.updateSlotLabels();
                  this.updateControlButtons();
                  this.createCarExhaust(tray.node.position.clone(), tray.definition.color);
                  tween(tray.node).to(0.08, {
                    scale: new Vec3(0.9, 1.02, 1),
                    eulerAngles: new Vec3(0, 0, -3)
                  }, {
                    easing: 'quadOut'
                  }).to(0.32, {
                    position: new Vec3(238, tray.node.position.y + 2, 0),
                    scale: new Vec3(1.03, 0.96, 1),
                    eulerAngles: Vec3.ZERO
                  }, {
                    easing: 'quadIn'
                  }).start();
                  tween(tray.opacity).delay(0.24).to(0.14, {
                    opacity: 0
                  }).start();
                  _context4.next = 11;
                  return this.wait(0.42);
                case 11:
                  tray.node.active = false;
                case 12:
                case "end":
                  return _context4.stop();
              }
            }, _callee4, this);
          }));
          function releaseTray(_x6) {
            return _releaseTray.apply(this, arguments);
          }
          return releaseTray;
        }();
        _proto.completeAnimal = /*#__PURE__*/function () {
          var _completeAnimal = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
            var _this15 = this;
            var animalBase, hasNextAnimal;
            return _regeneratorRuntime().wrap(function _callee5$(_context5) {
              while (1) switch (_context5.prev = _context5.next) {
                case 0:
                  if (!this.terminal) {
                    _context5.next = 2;
                    break;
                  }
                  return _context5.abrupt("return");
                case 2:
                  this.terminal = true;
                  this.completionWon = true;
                  this.workingSlotCount = 0;
                  this.setAutomationStatus('transforming');
                  this.progressLabel.string = '救援 100%';
                  this.status.string = "\u6700\u540E\u4E00\u8F86\u8F66\u5F00\u8D70\uFF0C" + this.currentLevel.name + "\u83B7\u6551\uFF01";
                  this.updateControlButtons();
                  this.resetSequencePose();
                  this.finalAnimal.active = true;
                  this.finalAnimalOpacity.opacity = 255;
                  animalBase = this.finalAnimal.position.clone();
                  tween(this.finalAnimal).to(0.12, {
                    scale: new Vec3(1.12, 0.86, 1)
                  }, {
                    easing: 'quadOut'
                  }).call(function () {
                    _this15.finalAnimalSprite.spriteFrame = _this15.finalAnimalFrames.joy;
                    _this15.playSound('success', 0.68);
                    _this15.playHaptic([16, 40, 22]);
                  }).to(0.18, {
                    position: animalBase.clone().add(new Vec3(0, 24, 0)),
                    scale: new Vec3(0.94, 1.08, 1)
                  }, {
                    easing: 'quadOut'
                  }).to(0.15, {
                    position: animalBase,
                    scale: new Vec3(1.1, 0.9, 1)
                  }, {
                    easing: 'quadIn'
                  }).to(0.14, {
                    position: animalBase.clone().add(new Vec3(0, 12, 0)),
                    scale: new Vec3(0.97, 1.05, 1)
                  }, {
                    easing: 'quadOut'
                  }).to(0.14, {
                    position: animalBase,
                    scale: Vec3.ONE
                  }, {
                    easing: 'quadIn'
                  }).delay(0.38).call(function () {
                    _this15.finalAnimalSprite.spriteFrame = _this15.finalAnimalFrames.blink;
                  }).delay(0.14).call(function () {
                    _this15.finalAnimalSprite.spriteFrame = _this15.finalAnimalFrames.joy;
                  }).start();
                  this.createCelebration();
                  _context5.next = 17;
                  return this.wait(1.42);
                case 17:
                  this.progressLabel.string = '救援 100%';
                  this.status.string = "\u5B8C\u6210\uFF1A\u5F69\u8272\u65B9\u5757\u5168\u90E8\u4E58\u8F66\u79BB\u5F00\uFF0C" + this.currentLevel.name + "\u83B7\u6551";
                  hasNextAnimal = this.currentLevelIndex < this.animalLevels.length - 1;
                  this.showResult('success', this.currentLevel.name + "\u83B7\u6551\uFF01", hasNextAnimal ? '下一位小伙伴听见啦' : '两位小伙伴都安全啦');
                  this.setAutomationStatus('passed');
                  this.updateControlButtons();
                case 23:
                case "end":
                  return _context5.stop();
              }
            }, _callee5, this);
          }));
          function completeAnimal() {
            return _completeAnimal.apply(this, arguments);
          }
          return completeAnimal;
        }();
        _proto.failBuild = /*#__PURE__*/function () {
          var _failBuild = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(needed) {
            var _this16 = this;
            return _regeneratorRuntime().wrap(function _callee6$(_context6) {
              while (1) switch (_context6.prev = _context6.next) {
                case 0:
                  if (!this.terminal) {
                    _context6.next = 2;
                    break;
                  }
                  return _context6.abrupt("return");
                case 2:
                  this.terminal = true;
                  this.completionWon = false;
                  this.status.string = "\u8F66\u4F4D\u5DF2\u88AB\u672A\u6EE1\u8F66\u8F86\u5360\u6EE1\uFF1B\u53EF\u8FBE\u4F4D\u7F6E\u9700\u8981 " + needed;
                  this.setAutomationStatus('failed');
                  this.playSound('fail', 0.52);
                  this.playHaptic([22, 42, 22]);
                  this.showResult('fail', '车位已满', "\u9700\u8981 " + needed);
                  this.activeSlots.forEach(function (tray) {
                    if (!tray) return;
                    tween(tray.node).to(0.08, {
                      position: tray.node.position.clone().add(new Vec3(-6, 0, 0))
                    }).to(0.08, {
                      position: tray.node.position.clone().add(new Vec3(6, 0, 0))
                    }).to(0.08, {
                      position: _this16.slotPositions[tray.slotIndex]
                    }).start();
                  });
                  _context6.next = 12;
                  return this.wait(0.28);
                case 12:
                  this.updateControlButtons();
                case 13:
                case "end":
                  return _context6.stop();
              }
            }, _callee6, this);
          }));
          function failBuild(_x7) {
            return _failBuild.apply(this, arguments);
          }
          return failBuild;
        }();
        _proto.resetSample = function resetSample() {
          this.clearTransientNodes();
          Tween.stopAllByTarget(this.blockAnimal);
          Tween.stopAllByTarget(this.sceneCard);
          this.blockAnimal.setScale(Vec3.ONE);
          this.blockAnimal.getComponent(UIOpacity).opacity = 255;
          this.finalAnimal.active = true;
          this.finalAnimalOpacity.opacity = 255;
          Tween.stopAllByTarget(this.guideAnimalOpacity);
          this.guideAnimalOpacity.opacity = 0;
          this.resetSequencePose();
          this.cells.forEach(function (cell) {
            cell.completed = false;
          });
          this.activeSlots = Array(5).fill(null);
          this.history = [];
          this.landedSoundCounter = 0;
          this.workingSlotCount = 0;
          this.trays.forEach(function (tray) {
            Tween.stopAllByTarget(tray.node);
            Tween.stopAllByTarget(tray.opacity);
            tray.remaining = tray.capacity;
            tray.countLabel.string = String(tray.remaining);
            tray.selected = false;
            tray.parked = false;
            tray.slotIndex = -1;
            tray.node.active = true;
            tray.node.setScale(Vec3.ONE);
            tray.opacity.opacity = 255;
            tray.button.interactable = false;
          });
          this.resolving = false;
          this.resolveRequested = false;
          this.movingCarCount = 0;
          this.terminal = false;
          this.completionWon = false;
          this.gamePaused = false;
          this.workingSlotCount = 0;
          this.refreshQueueTrays(false);
          this.hideResult();
          if (this.settingsPanel) this.settingsPanel.active = false;
          if (this.settingsScrim) this.settingsScrim.active = false;
          this.updateSlotLabels();
          this.updateBlueprintPreview(false);
          this.showStatus('点击下方队首颜色车', 4.2);
          this.setAutomationStatus('ready');
          this.updateControlButtons();
        };
        _proto.resetSequencePose = function resetSequencePose() {
          if (!this.finalAnimal || !this.finalAnimalSprite) return;
          Tween.stopAllByTarget(this.finalAnimal);
          Tween.stopAllByTarget(this.finalAnimalOpacity);
          this.finalAnimal.setScale(Vec3.ONE);
          this.finalAnimal.setPosition(0, this.compactLayout ? 112 : 145, 0);
          this.finalAnimalSprite.spriteFrame = this.finalAnimalFrames.normal;
        };
        _proto.updateBlueprintPreview = function updateBlueprintPreview(allowMilestone) {
          if (allowMilestone === void 0) {
            allowMilestone = true;
          }
          var exposed = new Set(this.getExposedCells());
          this.renderBoardCells(exposed);
          var completedCount = this.cells.filter(function (cell) {
            return cell.completed;
          }).length;
          var completedRatio = completedCount / this.cells.length;
          this.progressLabel.string = "\u6551\u63F4 " + Math.round(completedRatio * 100) + "%";
          this.progressFill.setScale(completedRatio, 1, 1);
          var milestone = Math.min(3, Math.floor(completedRatio * 4));
          if (allowMilestone && milestone > this.revealMilestone && completedCount > 0 && !this.terminal) {
            this.revealMilestone = milestone;
            this.celebrateRevealMilestone(milestone);
          } else if (!allowMilestone) {
            this.revealMilestone = milestone;
          }
          this.updateAutomationMetrics();
        };
        _proto.celebrateRevealMilestone = function celebrateRevealMilestone(milestone) {
          var _this17 = this;
          var messages = ['', "\u627E\u5230" + this.currentLevel.name + "\u5566", '已经露出一半啦', this.currentLevel.name + "\u5FEB\u81EA\u7531\u5566"];
          this.showStatus(messages[milestone], 1.8);
          this.playSound('layer', 0.42);
          this.playHaptic(milestone === 3 ? [10, 28, 12] : 10);
          tween(this.sceneCard).to(0.09, {
            scale: new Vec3(1.018, 1.018, 1)
          }, {
            easing: 'quadOut'
          }).to(0.14, {
            scale: Vec3.ONE
          }, {
            easing: 'backOut'
          }).start();
          var ring = new Node("RevealMilestone:" + milestone);
          ring.layer = Layers.Enum.UI_2D;
          ring.setPosition(0, this.compactLayout ? 112 : 145, 0);
          this.canvasNode.addChild(ring);
          ring.addComponent(UITransform).setContentSize(180, 180);
          var graphics = ring.addComponent(Graphics);
          graphics.lineWidth = 4;
          graphics.strokeColor = new Color(255, 224, 104, 205);
          graphics.circle(0, 0, 48);
          graphics.stroke();
          var opacity = ring.addComponent(UIOpacity);
          ring.setScale(0.6, 0.6, 1);
          this.transientNodes.push(ring);
          tween(ring).to(0.48, {
            scale: new Vec3(1.45, 1.45, 1)
          }, {
            easing: 'quadOut'
          }).start();
          tween(opacity).delay(0.12).to(0.36, {
            opacity: 0
          }, {
            easing: 'quadOut'
          }).call(function () {
            ring.destroy();
            _this17.transientNodes = _this17.transientNodes.filter(function (node) {
              return node !== ring;
            });
          }).start();
        };
        _proto.renderBoardCells = function renderBoardCells(exposed) {
          var _this18 = this;
          var graphics = this.boardGraphics;
          var size = this.blockVisualSize;
          var half = size / 2;
          var remaining = this.cells.filter(function (cell) {
            return !cell.completed;
          });
          graphics.clear();

          // 先按颜色批量画无缝底色，再在每颗方块内部画压边；既不露背景，又能一眼看到独立方块。
          this.paintDefinitions.forEach(function (definition) {
            var colored = remaining.filter(function (cell) {
              return cell.paintId === definition.id;
            });
            if (colored.length === 0) return;
            graphics.fillColor = definition.color;
            colored.forEach(function (cell) {
              return graphics.rect(cell.position.x - half, cell.position.y - half, size, size);
            });
            graphics.fill();
            graphics.lineWidth = Math.max(0.72, size * 0.055);
            graphics.strokeColor = new Color(definition.deep.r, definition.deep.g, definition.deep.b, 205);
            colored.forEach(function (cell) {
              return graphics.rect(cell.position.x - half + 0.48, cell.position.y - half + 0.48, size - 0.96, size - 0.96);
            });
            graphics.stroke();
          });

          // 参考拼块玩具的压塑高光，每颗都保留短高光，不依赖背景缝隙分格。
          graphics.fillColor = new Color(255, 255, 255, 78);
          remaining.forEach(function (cell) {
            return graphics.rect(cell.position.x - size * 0.3, cell.position.y + size * 0.18, size * 0.27, Math.max(0.75, size * 0.065));
          });
          graphics.fill();
          this.paintDefinitions.forEach(function (definition) {
            var boundaryCells = remaining.filter(function (cell) {
              return cell.boundary && cell.paintId === definition.id;
            });
            if (boundaryCells.length === 0) return;
            graphics.lineWidth = Math.max(1.25, size * 0.1);
            graphics.strokeColor = new Color(Math.max(22, definition.deep.r - 28), Math.max(22, definition.deep.g - 28), Math.max(22, definition.deep.b - 28), 255);
            boundaryCells.forEach(function (cell) {
              return graphics.rect(cell.position.x - half + 1, cell.position.y - half + 1, size - 2, size - 2);
            });
            graphics.stroke();
          });
          graphics.lineWidth = 0.72;
          graphics.strokeColor = new Color(255, 255, 255, 92);
          remaining.filter(function (cell) {
            return exposed.has(cell);
          }).forEach(function (cell) {
            return graphics.rect(cell.position.x - half + 2, cell.position.y - half + 2, size - 4, size - 4);
          });
          graphics.stroke();

          // 暴露方块与车辆共享几何标记，色觉差异不再是唯一匹配线索。
          remaining.filter(function (cell) {
            return exposed.has(cell);
          }).forEach(function (cell) {
            _this18.drawPaintSymbol(graphics, cell.paintId, cell.position.x, cell.position.y - size * 0.08, Math.max(2.4, size * 0.19), new Color(255, 255, 255, 205));
          });
        };
        _proto.updateSlotLabels = function updateSlotLabels() {
          var _this19 = this;
          this.slotLabels.forEach(function (label, index) {
            var tray = _this19.activeSlots[index];
            label.string = '';
            var slotGraphics = _this19.slotNodes[index].getComponent(Graphics);
            _this19.drawOutlinedPanel(slotGraphics, 58, 66, 15, tray ? new Color(tray.definition.color.r, tray.definition.color.g, tray.definition.color.b, 52) : new Color(115, 109, 145, 70), tray ? new Color(255, 255, 255, 205) : new Color(238, 237, 248, 175), 2, !tray);
            var parkingLine = tray ? new Color(255, 255, 255, 105) : new Color(246, 242, 255, 205);
            slotGraphics.lineWidth = 2;
            slotGraphics.strokeColor = parkingLine;
            slotGraphics.moveTo(-20, -23);
            slotGraphics.lineTo(-20, 15);
            slotGraphics.moveTo(20, -23);
            slotGraphics.lineTo(20, 15);
            slotGraphics.stroke();
            slotGraphics.fillColor = parkingLine;
            slotGraphics.roundRect(-13, -26, 26, 3, 1.5);
            slotGraphics.fill();
          });
          this.updateAutomationMetrics();
        };
        _proto.getExposedCells = function getExposedCells() {
          var key = function key(column, row) {
            return column + ":" + row;
          };
          var directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
          var blocked = new Set(this.cells.filter(function (cell) {
            return !cell.completed;
          }).map(function (cell) {
            return key(cell.column, cell.row);
          }));
          var air = new Set();
          var queue = [[this.boardMinColumn - 1, this.boardMinRow - 1]];
          var minColumn = this.boardMinColumn - 1;
          var maxColumn = this.boardMaxColumn + 1;
          var minRow = this.boardMinRow - 1;
          var maxRow = this.boardMaxRow + 1;
          var cursor = 0;
          var _loop5 = function _loop5() {
              var _queue$cursor2 = queue[cursor],
                column = _queue$cursor2[0],
                row = _queue$cursor2[1];
              cursor += 1;
              var airKey = key(column, row);
              if (air.has(airKey) || blocked.has(airKey)) return 0; // continue
              if (column < minColumn || column > maxColumn || row < minRow || row > maxRow) return 0; // continue
              air.add(airKey);
              directions.forEach(function (_ref6) {
                var dx = _ref6[0],
                  dy = _ref6[1];
                return queue.push([column + dx, row + dy]);
              });
            },
            _ret;
          while (cursor < queue.length) {
            _ret = _loop5();
            if (_ret === 0) continue;
          }
          return this.cells.filter(function (cell) {
            return !cell.completed && directions.some(function (_ref5) {
              var dx = _ref5[0],
                dy = _ref5[1];
              return air.has(key(cell.column + dx, cell.row + dy));
            });
          }).sort(function (a, b) {
            return a.row - b.row || a.column - b.column;
          });
        };
        _proto.allocateExposedJobs = function allocateExposedJobs() {
          var _this20 = this;
          var assigned = new Map();
          var cursorByPaint = new Map();
          var jobs = [];
          this.getExposedCells().forEach(function (cell) {
            var _cursorByPaint$get, _assigned$get2;
            if (jobs.length >= 16) return;
            var candidates = _this20.activeSlots.filter(function (tray) {
              var _assigned$get;
              return Boolean(tray && tray.parked && tray.definition.id === cell.paintId && tray.remaining - ((_assigned$get = assigned.get(tray)) != null ? _assigned$get : 0) > 0);
            });
            if (candidates.length === 0) return;
            var cursor = (_cursorByPaint$get = cursorByPaint.get(cell.paintId)) != null ? _cursorByPaint$get : 0;
            var tray = candidates[cursor % candidates.length];
            cursorByPaint.set(cell.paintId, cursor + 1);
            assigned.set(tray, ((_assigned$get2 = assigned.get(tray)) != null ? _assigned$get2 : 0) + 1);
            jobs.push({
              cell: cell,
              tray: tray
            });
          });
          return jobs;
        };
        _proto.getDefinition = function getDefinition(paintId) {
          return this.paintDefinitions.find(function (definition) {
            return definition.id === paintId;
          });
        };
        _proto.drawPaintSymbol = function drawPaintSymbol(graphics, paintId, x, y, size, color) {
          graphics.lineWidth = Math.max(1.2, size * 0.42);
          graphics.strokeColor = color;
          graphics.fillColor = color;
          if (paintId === 'cream') {
            graphics.moveTo(x - size, y - size * 0.45);
            graphics.lineTo(x + size, y - size * 0.45);
            graphics.moveTo(x - size, y + size * 0.45);
            graphics.lineTo(x + size, y + size * 0.45);
            graphics.stroke();
            return;
          }
          if (paintId === 'ivory') {
            graphics.circle(x, y, size * 0.72);
            graphics.fill();
            return;
          }
          if (paintId === 'oat') {
            graphics.moveTo(x, y + size);
            graphics.lineTo(x + size, y - size * 0.72);
            graphics.lineTo(x - size, y - size * 0.72);
            graphics.close();
            graphics.fill();
            return;
          }
          if (paintId === 'cocoa') {
            graphics.moveTo(x - size, y);
            graphics.lineTo(x + size, y);
            graphics.moveTo(x, y - size);
            graphics.lineTo(x, y + size);
            graphics.stroke();
            return;
          }
          graphics.moveTo(x, y + size);
          graphics.lineTo(x + size, y);
          graphics.lineTo(x, y - size);
          graphics.lineTo(x - size, y);
          graphics.close();
          graphics.fill();
        };
        _proto.createPaintTrayNode = function createPaintTrayNode(definition, home, amount, batchIndex) {
          var node = new Node("ColorCar:" + definition.id + ":" + batchIndex);
          node.layer = Layers.Enum.UI_2D;
          node.setPosition(home);
          this.canvasNode.addChild(node);
          node.addComponent(UITransform).setContentSize(58, 54);
          var graphics = node.addComponent(Graphics);
          // 侧视空车：车身颜色就是它接载的方块颜色，避免再依赖文字解释。
          graphics.fillColor = new Color(44, 40, 67, 72);
          graphics.ellipse(0, -22, 28, 6);
          graphics.fill();
          graphics.fillColor = definition.deep;
          graphics.roundRect(-17, 1, 35, 20, 8);
          graphics.fill();
          graphics.fillColor = definition.color;
          graphics.roundRect(-14, 3, 30, 17, 7);
          graphics.fill();
          graphics.fillColor = new Color(196, 232, 240, 255);
          graphics.roundRect(-10, 7, 10, 9, 3);
          graphics.roundRect(3, 7, 9, 9, 3);
          graphics.fill();
          graphics.fillColor = definition.deep;
          graphics.roundRect(-28, -16, 56, 28, 8);
          graphics.fill();
          graphics.fillColor = definition.color;
          graphics.roundRect(-26, -13, 52, 23, 7);
          graphics.fill();
          graphics.fillColor = new Color(255, 255, 255, 118);
          graphics.roundRect(-20, 3, 14, 4, 2);
          graphics.fill();
          graphics.fillColor = new Color(255, 244, 166, 255);
          graphics.roundRect(22, -5, 5, 7, 2);
          graphics.fill();
          this.drawPaintSymbol(graphics, definition.id, -18, -3, 4.2, new Color(255, 255, 255, 235));
          graphics.fillColor = new Color(48, 48, 68, 255);
          graphics.circle(-17, -14, 7);
          graphics.circle(17, -14, 7);
          graphics.fill();
          graphics.fillColor = new Color(225, 229, 240, 255);
          graphics.circle(-17, -14, 3.1);
          graphics.circle(17, -14, 3.1);
          graphics.fill();
          var countNode = new Node('CountPanel');
          countNode.layer = Layers.Enum.UI_2D;
          countNode.setPosition(2, -3, 0);
          node.addChild(countNode);
          countNode.addComponent(UITransform).setContentSize(36, 24);
          var countLabel = this.addLabel(countNode, String(amount), 0, 0, 16, Color.WHITE, 34, true);
          countLabel.node.name = 'Count';
          return node;
        };
        _proto.startTrayIdle = function startTrayIdle(tray, index) {
          if (tray.selected || !tray.node.active) return;
          Tween.stopAllByTarget(tray.node);
          tray.node.setPosition(tray.home);
          tween(tray.node).delay(index % 5 * 0.06).repeatForever(tween().to(0.72, {
            position: new Vec3(tray.home.x, tray.home.y + 2.5, 0)
          }, {
            easing: 'sineInOut'
          }).to(0.72, {
            position: tray.home.clone()
          }, {
            easing: 'sineInOut'
          })).start();
        };
        _proto.createSoftSquare = function createSoftSquare(parent, name, x, y, size, fill, edge) {
          var node = new Node(name);
          node.layer = Layers.Enum.UI_2D;
          node.setPosition(x, y, 0);
          parent.addChild(node);
          node.addComponent(UITransform).setContentSize(size, size);
          var graphics = node.addComponent(Graphics);
          graphics.fillColor = new Color(48, 54, 77, 28);
          graphics.roundRect(-size / 2 + 1.5, -size / 2 - 1.5, size - 1, size - 1, size * 0.28);
          graphics.fill();
          graphics.fillColor = fill;
          graphics.roundRect(-size / 2, -size / 2, size, size, size * 0.28);
          graphics.fill();
          graphics.lineWidth = Math.max(0.85, Math.min(1.4, size * 0.07));
          graphics.strokeColor = edge;
          graphics.stroke();
          graphics.fillColor = new Color(255, 255, 255, 130);
          graphics.roundRect(-size * 0.26, size * 0.14, size * 0.28, size * 0.12, size * 0.06);
          graphics.fill();
          node.addComponent(UIOpacity);
          return node;
        };
        _proto.createCelebration = function createCelebration() {
          var _this21 = this;
          var colors = this.paintDefinitions.map(function (definition) {
            return definition.color;
          });
          var burstY = this.compactLayout ? 72 : 92;
          var _loop6 = function _loop6() {
            var ring = new Node("RescueRing:" + ringIndex);
            ring.layer = Layers.Enum.UI_2D;
            ring.setPosition(0, burstY, 0);
            _this21.canvasNode.addChild(ring);
            ring.addComponent(UITransform).setContentSize(160, 160);
            var graphics = ring.addComponent(Graphics);
            graphics.lineWidth = 5 - ringIndex;
            graphics.strokeColor = ringIndex === 0 ? new Color(255, 220, 90, 210) : new Color(255, 255, 255, 195);
            graphics.circle(0, 0, 42 + ringIndex * 12);
            graphics.stroke();
            var opacity = ring.addComponent(UIOpacity);
            ring.setScale(0.45, 0.45, 1);
            _this21.transientNodes.push(ring);
            tween(ring).delay(0.16 + ringIndex * 0.1).to(0.68, {
              scale: new Vec3(1.55, 1.55, 1)
            }, {
              easing: 'quadOut'
            }).start();
            tween(opacity).delay(0.28 + ringIndex * 0.1).to(0.56, {
              opacity: 0
            }, {
              easing: 'quadOut'
            }).call(function () {
              ring.destroy();
              _this21.transientNodes = _this21.transientNodes.filter(function (node) {
                return node !== ring;
              });
            }).start();
          };
          for (var ringIndex = 0; ringIndex < 2; ringIndex += 1) {
            _loop6();
          }
          var _loop7 = function _loop7() {
            var angle = Math.PI * 2 * index / 26;
            var spark = _this21.createSoftSquare(_this21.canvasNode, "PaintSpark" + index, 0, burstY, 8 + index % 3 * 2, colors[index % colors.length], colors[index % colors.length]);
            _this21.transientNodes.push(spark);
            tween(spark).delay(0.2 + index % 3 * 0.025).by(0.84, {
              position: new Vec3(Math.cos(angle) * (126 + index % 3 * 18), Math.sin(angle) * (126 + index % 2 * 24), 0),
              scale: new Vec3(-0.75, -0.75, 0),
              eulerAngles: new Vec3(0, 0, 150)
            }, {
              easing: 'quadOut'
            }).call(function () {
              spark.destroy();
              _this21.transientNodes = _this21.transientNodes.filter(function (node) {
                return node !== spark;
              });
            }).start();
          };
          for (var index = 0; index < 26; index += 1) {
            _loop7();
          }
        };
        _proto.celebrateOpenedPaths = /*#__PURE__*/function () {
          var _celebrateOpenedPaths = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(jobs) {
            var _this22 = this;
            var sampleJobs;
            return _regeneratorRuntime().wrap(function _callee7$(_context7) {
              while (1) switch (_context7.prev = _context7.next) {
                case 0:
                  this.playSound('layer', 0.32);
                  tween(this.sceneCard).to(0.08, {
                    scale: new Vec3(1.008, 1.008, 1)
                  }, {
                    easing: 'quadOut'
                  }).to(0.1, {
                    scale: Vec3.ONE
                  }, {
                    easing: 'quadInOut'
                  }).start();
                  sampleJobs = jobs.filter(function (_, index) {
                    return index % Math.max(1, Math.ceil(jobs.length / 4)) === 0;
                  }).slice(0, 4);
                  sampleJobs.forEach(function (job, index) {
                    var definition = _this22.getDefinition(job.cell.paintId);
                    var spark = _this22.createSoftSquare(_this22.canvasNode, "PathSpark:" + index, job.cell.position.x, job.cell.position.y, 6, definition.color, definition.deep);
                    _this22.transientNodes.push(spark);
                    tween(spark).by(0.28, {
                      position: new Vec3((index - 2) * 8, 26 + index % 2 * 8, 0),
                      scale: new Vec3(-0.55, -0.55, 0),
                      eulerAngles: new Vec3(0, 0, 80)
                    }, {
                      easing: 'quadOut'
                    }).call(function () {
                      spark.destroy();
                      _this22.transientNodes = _this22.transientNodes.filter(function (node) {
                        return node !== spark;
                      });
                    }).start();
                  });
                  _context7.next = 6;
                  return this.wait(0.13);
                case 6:
                case "end":
                  return _context7.stop();
              }
            }, _callee7, this);
          }));
          function celebrateOpenedPaths(_x8) {
            return _celebrateOpenedPaths.apply(this, arguments);
          }
          return celebrateOpenedPaths;
        }();
        _proto.createCarExhaust = function createCarExhaust(position, color) {
          var _this23 = this;
          var _loop8 = function _loop8() {
            var puff = new Node("CarExhaust:" + index);
            puff.layer = Layers.Enum.UI_2D;
            puff.setPosition(position.x - 27 - index * 4, position.y - 9 + index % 2 * 4, 0);
            _this23.canvasNode.addChild(puff);
            puff.addComponent(UITransform).setContentSize(18, 18);
            var graphics = puff.addComponent(Graphics);
            graphics.fillColor = new Color(Math.min(255, color.r + 85), Math.min(255, color.g + 85), Math.min(255, color.b + 85), 190);
            graphics.circle(0, 0, 4 + index);
            graphics.fill();
            var opacity = puff.addComponent(UIOpacity);
            _this23.transientNodes.push(puff);
            tween(puff).delay(index * 0.04).by(0.34, {
              position: new Vec3(-18 - index * 5, 8 + index * 2, 0),
              scale: new Vec3(1.2, 1.2, 0)
            }, {
              easing: 'quadOut'
            }).start();
            tween(opacity).delay(index * 0.04).to(0.34, {
              opacity: 0
            }, {
              easing: 'quadOut'
            }).call(function () {
              puff.destroy();
              _this23.transientNodes = _this23.transientNodes.filter(function (node) {
                return node !== puff;
              });
            }).start();
          };
          for (var index = 0; index < 3; index += 1) {
            _loop8();
          }
        };
        _proto.createLandingRipple = function createLandingRipple(position, color) {
          var _this24 = this;
          var ripple = new Node('LandingRipple');
          ripple.layer = Layers.Enum.UI_2D;
          ripple.setPosition(position);
          this.canvasNode.addChild(ripple);
          ripple.addComponent(UITransform).setContentSize(18, 18);
          var graphics = ripple.addComponent(Graphics);
          graphics.lineWidth = 1.6;
          graphics.strokeColor = new Color(color.r, color.g, color.b, 180);
          graphics.circle(0, 0, 6);
          graphics.stroke();
          var opacity = ripple.addComponent(UIOpacity);
          this.transientNodes.push(ripple);
          tween(ripple).to(0.2, {
            scale: new Vec3(1.7, 1.7, 1)
          }, {
            easing: 'quadOut'
          }).start();
          tween(opacity).to(0.2, {
            opacity: 0
          }, {
            easing: 'quadOut'
          }).call(function () {
            ripple.destroy();
            _this24.transientNodes = _this24.transientNodes.filter(function (node) {
              return node !== ripple;
            });
          }).start();
        };
        _proto.captureSnapshot = function captureSnapshot() {
          return {
            completedCells: this.cells.map(function (cell) {
              return cell.completed;
            }),
            trays: this.trays.map(function (tray) {
              return {
                remaining: tray.remaining,
                selected: tray.selected,
                slotIndex: tray.slotIndex
              };
            })
          };
        };
        _proto.undoLastMove = function undoLastMove() {
          var _this25 = this;
          if (this.gamePaused || this.resolving || this.movingCarCount > 0 || this.history.length === 0 || this.completionWon) return;
          var snapshot = this.history.pop();
          this.clearTransientNodes();
          this.terminal = false;
          this.completionWon = false;
          this.workingSlotCount = 0;
          this.hideResult();
          Tween.stopAllByTarget(this.blockAnimal);
          this.blockAnimal.setScale(Vec3.ONE);
          this.blockAnimal.getComponent(UIOpacity).opacity = 255;
          this.finalAnimal.active = true;
          this.finalAnimalOpacity.opacity = 255;
          Tween.stopAllByTarget(this.guideAnimalOpacity);
          this.guideAnimalOpacity.opacity = 0;
          this.resetSequencePose();
          this.cells.forEach(function (cell, index) {
            cell.completed = snapshot.completedCells[index];
          });
          this.activeSlots = Array(5).fill(null);
          this.trays.forEach(function (tray, index) {
            var trayState = snapshot.trays[index];
            Tween.stopAllByTarget(tray.node);
            Tween.stopAllByTarget(tray.opacity);
            tray.remaining = trayState.remaining;
            tray.selected = trayState.selected;
            tray.parked = trayState.slotIndex >= 0 && trayState.remaining > 0;
            tray.slotIndex = trayState.slotIndex;
            tray.countLabel.string = String(tray.remaining);
            tray.opacity.opacity = 255;
            if (tray.slotIndex >= 0 && tray.remaining > 0) {
              tray.node.active = true;
              tray.node.setPosition(_this25.slotPositions[tray.slotIndex]);
              tray.node.setScale(0.92, 0.92, 1);
              tray.button.interactable = false;
              _this25.activeSlots[tray.slotIndex] = tray;
            } else if (tray.remaining > 0 && !tray.selected) {
              tray.node.active = true;
              tray.node.setScale(Vec3.ONE);
              tray.button.interactable = false;
            } else {
              tray.node.active = false;
              tray.button.interactable = false;
            }
          });
          this.refreshQueueTrays(false);
          this.updateSlotLabels();
          this.updateBlueprintPreview(false);
          this.showStatus('已撤销，可以重新选择', 2.2);
          this.setAutomationStatus(this.activeSlots.some(Boolean) ? 'waiting' : 'ready');
          this.playSound('select', 0.34);
          this.playHaptic(8);
          this.updateControlButtons();
        };
        _proto.restartLevel = function restartLevel() {
          if (this.gamePaused || this.resolving || this.movingCarCount > 0 || !this.finalAnimal) return;
          if (this.history.length > 0 && !this.terminal) {
            this.showResult('restart-confirm', '重新开始？', '当前救援进度会清空');
            return;
          }
          this.resetSample();
          this.playSound('select', 0.34);
        };
        _proto.showResult = function showResult(kind, title, detail) {
          this.closeSettings(false);
          this.resultMode = kind;
          this.resultScrim.active = true;
          this.resultBanner.active = true;
          this.resultScrim.setSiblingIndex(this.canvasNode.children.length - 2);
          this.resultBanner.setSiblingIndex(this.canvasNode.children.length - 1);
          this.resultBanner.setScale(0.86, 0.86, 1);
          this.resultTitle.string = title;
          this.resultTitle.color = kind === 'fail' ? new Color(174, 75, 83, 255) : new Color(89, 70, 154, 255);
          this.resultDetail.string = detail;
          if (kind === 'success') {
            this.resultPrimaryLabel.string = this.currentLevelIndex < this.animalLevels.length - 1 ? '下一只动物' : '完成试玩';
            this.resultSecondaryLabel.string = '再玩一次';
          } else if (kind === 'fail') {
            this.resultPrimaryLabel.string = '撤销一步';
            this.resultSecondaryLabel.string = '重新开始';
          } else if (kind === 'restart-confirm') {
            this.resultPrimaryLabel.string = '继续救援';
            this.resultSecondaryLabel.string = '重新开始';
          } else {
            this.resultPrimaryLabel.string = '重新挑战';
            this.resultSecondaryLabel.string = '留在这里';
          }
          this.resultPrimaryButton.interactable = kind !== 'fail' || this.history.length > 0;
          tween(this.resultBanner).to(0.24, {
            scale: Vec3.ONE
          }, {
            easing: 'backOut'
          }).start();
          this.updateControlButtons();
        };
        _proto.hideResult = function hideResult() {
          Tween.stopAllByTarget(this.resultBanner);
          this.resultScrim.active = false;
          this.resultBanner.active = false;
          this.resultBanner.setScale(Vec3.ONE);
          this.resultMode = null;
        };
        _proto.handleResultPrimary = function handleResultPrimary() {
          if (this.resultMode === 'success') {
            if (this.currentLevelIndex < this.animalLevels.length - 1) {
              void this.advanceToNextAnimal();
            } else {
              this.showResult('journey-complete', '试玩完成！', '兔兔和猫猫都安全啦');
              this.setAutomationStatus('passed');
            }
            return;
          }
          if (this.resultMode === 'fail') {
            this.undoLastMove();
            return;
          }
          if (this.resultMode === 'restart-confirm') {
            this.hideResult();
            this.updateControlButtons();
            return;
          }
          if (this.resultMode === 'journey-complete') {
            void this.switchToLevel(0);
          }
        };
        _proto.handleResultSecondary = function handleResultSecondary() {
          if (this.resultMode === 'fail' || this.resultMode === 'restart-confirm' || this.resultMode === 'success') {
            this.resetSample();
            this.playSound('select', 0.34);
            return;
          }
          if (this.resultMode === 'journey-complete') {
            this.hideResult();
            this.updateControlButtons();
          }
        };
        _proto.advanceToNextAnimal = /*#__PURE__*/function () {
          var _advanceToNextAnimal = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
            return _regeneratorRuntime().wrap(function _callee8$(_context8) {
              while (1) switch (_context8.prev = _context8.next) {
                case 0:
                  if (!(this.currentLevelIndex >= this.animalLevels.length - 1)) {
                    _context8.next = 2;
                    break;
                  }
                  return _context8.abrupt("return");
                case 2:
                  this.hideResult();
                  this.playSound('select', 0.38);
                  tween(this.finalAnimal).to(0.24, {
                    position: this.finalAnimal.position.clone().add(new Vec3(72, 6, 0)),
                    scale: new Vec3(0.78, 0.78, 1)
                  }, {
                    easing: 'quadIn'
                  }).start();
                  _context8.next = 7;
                  return this.wait(0.26);
                case 7:
                  _context8.next = 9;
                  return this.switchToLevel(this.currentLevelIndex + 1);
                case 9:
                case "end":
                  return _context8.stop();
              }
            }, _callee8, this);
          }));
          function advanceToNextAnimal() {
            return _advanceToNextAnimal.apply(this, arguments);
          }
          return advanceToNextAnimal;
        }();
        _proto.switchToLevel = /*#__PURE__*/function () {
          var _switchToLevel = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(levelIndex) {
            return _regeneratorRuntime().wrap(function _callee9$(_context9) {
              while (1) switch (_context9.prev = _context9.next) {
                case 0:
                  this.currentLevelIndex = Math.max(0, Math.min(this.animalLevels.length - 1, levelIndex));
                  this.buildCurrentLevelBlueprint();
                  this.createPaintTrays();
                  this.applyCurrentAnimalFrames();
                  this.resetSample();
                  this.finalAnimal.setPosition(-54, this.compactLayout ? 112 : 145, 0);
                  this.finalAnimal.setScale(0.82, 0.82, 1);
                  tween(this.finalAnimal).to(0.34, {
                    position: new Vec3(0, this.compactLayout ? 112 : 145, 0),
                    scale: Vec3.ONE
                  }, {
                    easing: 'backOut'
                  }).start();
                  this.showStatus(this.currentLevel.name + "\u6B63\u5728\u7B49\u5F85\u6551\u63F4", 3.4);
                  this.playHaptic(12);
                  this.setAutomationStatus('ready');
                  this.updateControlButtons();
                  _context9.next = 14;
                  return this.wait(0.34);
                case 14:
                case "end":
                  return _context9.stop();
              }
            }, _callee9, this);
          }));
          function switchToLevel(_x9) {
            return _switchToLevel.apply(this, arguments);
          }
          return switchToLevel;
        }();
        _proto.clearTransientNodes = function clearTransientNodes() {
          this.transientNodes.forEach(function (node) {
            if (node && node.isValid) node.destroy();
          });
          this.transientNodes = [];
        };
        _proto.updateControlButtons = function updateControlButtons() {
          var _this$resultBanner,
            _this$settingsPanel,
            _this26 = this;
          if (!this.undoButton || !this.restartButton || !this.settingsButton) return;
          var stable = !this.resolving && this.movingCarCount === 0;
          var overlayOpen = Boolean(((_this$resultBanner = this.resultBanner) == null ? void 0 : _this$resultBanner.active) || ((_this$settingsPanel = this.settingsPanel) == null ? void 0 : _this$settingsPanel.active));
          var undoEnabled = stable && !overlayOpen && !this.gamePaused && this.history.length > 0 && !this.completionWon;
          var restartEnabled = stable && !overlayOpen && !this.gamePaused && Boolean(this.finalAnimal);
          var settingsEnabled = stable && !overlayOpen && Boolean(this.finalAnimal);
          this.undoButton.interactable = undoEnabled;
          this.undoButtonOpacity.opacity = undoEnabled ? 255 : 96;
          this.restartButton.interactable = restartEnabled;
          this.restartButtonOpacity.opacity = restartEnabled ? 255 : 96;
          this.settingsButton.interactable = settingsEnabled;
          this.settingsButtonOpacity.opacity = settingsEnabled ? 255 : 96;
          this.trays.forEach(function (tray) {
            tray.button.interactable = Boolean(_this26.finalAnimal && !_this26.gamePaused && !overlayOpen && !_this26.terminal && _this26.activeSlots.some(function (active) {
              return active === null;
            }) && _this26.isQueueFront(tray));
          });
          this.updateAutomationMetrics();
        };
        _proto.updateAutomationMetrics = function updateAutomationMetrics() {
          var _this27 = this,
            _this$resultMode,
            _this$statusToast;
          if (typeof document === 'undefined') return;
          document.documentElement.dataset.completedCells = String(this.cells.filter(function (cell) {
            return cell.completed;
          }).length);
          document.documentElement.dataset.totalCells = String(this.cells.length);
          document.documentElement.dataset.undoDepth = String(this.history.length);
          document.documentElement.dataset.activePaintSlots = String(this.activeSlots.filter(Boolean).length);
          document.documentElement.dataset.workingPaintSlots = String(this.workingSlotCount);
          document.documentElement.dataset.availablePaintBoxes = String(this.trays.filter(function (tray) {
            return _this27.isQueueFront(tray);
          }).length);
          document.documentElement.dataset.totalPaintBoxes = String(this.trays.length);
          document.documentElement.dataset.paintColorCount = String(this.paintDefinitions.length);
          document.documentElement.dataset.paintQueueColumns = '4';
          document.documentElement.dataset.paintSlotCapacity = String(this.activeSlots.length);
          document.documentElement.dataset.boardColumns = String(this.boardMaxColumn - this.boardMinColumn + 1);
          document.documentElement.dataset.boardRows = String(this.boardMaxRow - this.boardMinRow + 1);
          document.documentElement.dataset.exposedCells = String(this.getExposedCells().length);
          document.documentElement.dataset.activeColorCars = String(this.activeSlots.filter(Boolean).length);
          document.documentElement.dataset.movingColorCars = String(this.movingCarCount);
          document.documentElement.dataset.soundEnabled = String(this.soundEnabled);
          document.documentElement.dataset.hapticsEnabled = String(this.hapticsEnabled);
          document.documentElement.dataset.gamePaused = String(this.gamePaused);
          document.documentElement.dataset.resultMode = (_this$resultMode = this.resultMode) != null ? _this$resultMode : 'none';
          document.documentElement.dataset.statusVisible = String(Boolean((_this$statusToast = this.statusToast) == null ? void 0 : _this$statusToast.active));
          document.documentElement.dataset.currentAnimal = this.currentLevel.id;
          document.documentElement.dataset.currentAnimalName = this.currentLevel.name;
          document.documentElement.dataset.currentLevelIndex = String(this.currentLevelIndex);
          document.documentElement.dataset.levelCount = String(this.animalLevels.length);
          document.documentElement.dataset.revealMilestone = String(this.revealMilestone);
          document.documentElement.dataset.paintSymbols = 'stripes,dot,triangle,cross,diamond';
        };
        _proto.createSparkle = function createSparkle(name, x, y, size, color, delay) {
          var node = new Node(name);
          node.layer = Layers.Enum.UI_2D;
          node.setPosition(x, y, 0);
          this.canvasNode.addChild(node);
          node.addComponent(UITransform).setContentSize(size * 2, size * 2);
          var graphics = node.addComponent(Graphics);
          graphics.fillColor = color;
          graphics.moveTo(0, size);
          graphics.lineTo(size * 0.24, size * 0.24);
          graphics.lineTo(size, 0);
          graphics.lineTo(size * 0.24, -size * 0.24);
          graphics.lineTo(0, -size);
          graphics.lineTo(-size * 0.24, -size * 0.24);
          graphics.lineTo(-size, 0);
          graphics.lineTo(-size * 0.24, size * 0.24);
          graphics.close();
          graphics.fill();
          var opacity = node.addComponent(UIOpacity);
          tween(node).delay(delay).repeatForever(tween().to(0.8, {
            scale: new Vec3(1.22, 1.22, 1),
            eulerAngles: new Vec3(0, 0, 45)
          }, {
            easing: 'sineInOut'
          }).to(0.8, {
            scale: Vec3.ONE,
            eulerAngles: Vec3.ZERO
          }, {
            easing: 'sineInOut'
          })).start();
          tween(opacity).delay(delay).repeatForever(tween().to(0.8, {
            opacity: 145
          }, {
            easing: 'sineInOut'
          }).to(0.8, {
            opacity: 255
          }, {
            easing: 'sineInOut'
          })).start();
        };
        _proto.createControlButton = function createControlButton(name, text, x, y) {
          var node = this.addOutlinedPanel(this.canvasNode, name, x, y, 46, 44, 22, new Color(255, 252, 246, 248), new Color(219, 202, 232, 255), 2, false);
          this.addLabel(node, text, 0, 0, 12, new Color(88, 82, 108, 255), 42, true);
          var button = node.addComponent(Button);
          var opacity = node.addComponent(UIOpacity);
          return {
            node: node,
            button: button,
            opacity: opacity
          };
        };
        _proto.createActionButton = function createActionButton(parent, name, text, x, y, width, fill, stroke, labelColor) {
          var node = this.addOutlinedPanel(parent, name, x, y, width, 44, 16, fill, stroke, 2, false);
          var label = this.addLabel(node, text, 0, 0, 13, labelColor, width - 18, true);
          var button = node.addComponent(Button);
          return {
            node: node,
            button: button,
            label: label
          };
        };
        _proto.addOutlinedPanel = function addOutlinedPanel(parent, name, x, y, width, height, radius, fill, stroke, lineWidth, dashed) {
          var node = new Node(name);
          node.layer = Layers.Enum.UI_2D;
          node.setPosition(x, y, 0);
          parent.addChild(node);
          node.addComponent(UITransform).setContentSize(width, height);
          var graphics = node.addComponent(Graphics);
          this.drawOutlinedPanel(graphics, width, height, radius, fill, stroke, lineWidth, dashed);
          return node;
        };
        _proto.drawOutlinedPanel = function drawOutlinedPanel(graphics, width, height, radius, fill, stroke, lineWidth, dashed) {
          graphics.clear();
          graphics.fillColor = fill;
          graphics.roundRect(-width / 2, -height / 2, width, height, radius);
          graphics.fill();
          graphics.lineWidth = lineWidth;
          graphics.strokeColor = stroke;
          graphics.roundRect(-width / 2 + 1, -height / 2 + 1, width - 2, height - 2, Math.max(1, radius - 1));
          graphics.stroke();
          if (dashed) {
            graphics.fillColor = stroke;
            [-32, 0, 32].forEach(function (offset) {
              graphics.roundRect(offset - 7, height / 2 - 4, 14, 2, 1);
              graphics.fill();
            });
          }
        };
        _proto.addPanel = function addPanel(parent, name, x, y, width, height, radius, color) {
          var node = new Node(name);
          node.layer = Layers.Enum.UI_2D;
          node.setPosition(x, y, 0);
          parent.addChild(node);
          node.addComponent(UITransform).setContentSize(width, height);
          var graphics = node.addComponent(Graphics);
          graphics.fillColor = color;
          graphics.roundRect(-width / 2, -height / 2, width, height, radius);
          graphics.fill();
          return node;
        };
        _proto.addLabel = function addLabel(parent, text, x, y, fontSize, color, width, bold) {
          if (bold === void 0) {
            bold = false;
          }
          var node = new Node("Label:" + text);
          node.layer = Layers.Enum.UI_2D;
          node.setPosition(x, y, 0);
          parent.addChild(node);
          node.addComponent(UITransform).setContentSize(width, fontSize * 1.9);
          var label = node.addComponent(Label);
          label.string = text;
          label.fontSize = fontSize;
          label.lineHeight = Math.round(fontSize * 1.3);
          label.color = color;
          label.isBold = bold;
          label.horizontalAlign = HorizontalTextAlignment.CENTER;
          label.verticalAlign = VerticalTextAlignment.CENTER;
          label.overflow = Label.Overflow.SHRINK;
          return label;
        };
        _proto.wait = function wait(seconds) {
          var _this28 = this;
          return new Promise(function (resolve) {
            return _this28.scheduleOnce(resolve, seconds);
          });
        };
        _proto.setAutomationStatus = function setAutomationStatus(status) {
          if (typeof document !== 'undefined') {
            document.documentElement.dataset.t1Status = status;
            document.documentElement.dataset.renderMode = 'color-car-rescue';
            document.documentElement.dataset.visualDimension = '2d';
            document.documentElement.dataset.assetPipeline = 'full-frame-sprite-sequence-2d';
            document.documentElement.dataset.uiVersion = 'two-animal-rescue-polish-v10';
            document.documentElement.dataset.audioPipeline = 'resource-wav-cues';
            document.documentElement.dataset.layoutMode = this.compactLayout ? 'compact' : 'tall';
            document.documentElement.dataset.blockStyle = 'beveled-touching-square-grid-animal-outline';
            document.documentElement.dataset.gameplayMetaphor = 'walking-shells-board-color-cars';
            document.documentElement.dataset.paintResolution = 'parallel-active-slots';
            document.documentElement.dataset.inputConcurrency = 'select-while-walkers-moving';
            document.documentElement.dataset.walkerRoute = 'global-shortest-empty-route-to-car';
            document.documentElement.dataset.boardRenderer = 'single-batched-graphics';
            document.documentElement.dataset.paintBoxModel = 'four-column-front-choice-car-queues';
            document.documentElement.dataset.unlockModel = 'outside-four-direction-connected-path';
            document.documentElement.dataset.onboardingModel = 'single-first-action-toast';
            document.documentElement.dataset.resultFlow = 'two-animal-success-journey-fail-undo-restart';
            document.documentElement.dataset.settingsModel = 'pause-sound-haptics';
            this.updateAutomationMetrics();
          }
        };
        _createClass(T1PaintBuildProof, [{
          key: "currentLevel",
          get: function get() {
            return this.animalLevels[this.currentLevelIndex];
          }
        }]);
        return T1PaintBuildProof;
      }(Component)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/T1PaintBuildThreeDProof.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _inheritsLoose, _asyncToGenerator, _regeneratorRuntime, cclegacy, _decorator, view, ResolutionPolicy, resources, Material, director, Color, Node, Vec3, Camera, Layers, DirectionalLight, UITransform, Canvas, Button, UIOpacity, Label, tween, Tween, MeshRenderer, primitives, utils, Graphics, HorizontalTextAlignment, VerticalTextAlignment, Component;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
      _asyncToGenerator = module.asyncToGenerator;
      _regeneratorRuntime = module.regeneratorRuntime;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      view = module.view;
      ResolutionPolicy = module.ResolutionPolicy;
      resources = module.resources;
      Material = module.Material;
      director = module.director;
      Color = module.Color;
      Node = module.Node;
      Vec3 = module.Vec3;
      Camera = module.Camera;
      Layers = module.Layers;
      DirectionalLight = module.DirectionalLight;
      UITransform = module.UITransform;
      Canvas = module.Canvas;
      Button = module.Button;
      UIOpacity = module.UIOpacity;
      Label = module.Label;
      tween = module.tween;
      Tween = module.Tween;
      MeshRenderer = module.MeshRenderer;
      primitives = module.primitives;
      utils = module.utils;
      Graphics = module.Graphics;
      HorizontalTextAlignment = module.HorizontalTextAlignment;
      VerticalTextAlignment = module.VerticalTextAlignment;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "51bb4NzUehIJpwKae4CuEwG", "T1PaintBuildThreeDProof", undefined);
      var ccclass = _decorator.ccclass;
      var T1PaintBuildThreeDProof = exports('T1PaintBuildThreeDProof', (_dec = ccclass('T1PaintBuildThreeDProof'), _dec(_class = /*#__PURE__*/function (_Component) {
        _inheritsLoose(T1PaintBuildThreeDProof, _Component);
        function T1PaintBuildThreeDProof() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _this.paintDefinitions = [{
            id: 'coral',
            name: '珊瑚红',
            color: new Color(244, 125, 116, 255),
            deep: new Color(190, 67, 63, 255),
            total: 8
          }, {
            id: 'gold',
            name: '暖金黄',
            color: new Color(246, 193, 72, 255),
            deep: new Color(181, 128, 35, 255),
            total: 6
          }, {
            id: 'sky',
            name: '天空蓝',
            color: new Color(99, 174, 226, 255),
            deep: new Color(47, 117, 172, 255),
            total: 6
          }];
          _this.slotPositions = [new Vec3(-74, -212, 0), new Vec3(74, -212, 0)];
          _this.slotWorldPositions = [new Vec3(-0.85, -1.08, 1.1), new Vec3(0.85, -1.08, 1.1)];
          _this.meshes = new Map();
          _this.materials = new Map();
          _this.standardMaterial = void 0;
          _this.canvasNode = void 0;
          _this.blockRoot = void 0;
          _this.finalBunny = void 0;
          _this.status = void 0;
          _this.progressLabel = void 0;
          _this.slotLabels = [];
          _this.cells = [];
          _this.trays = [];
          _this.activeSlots = [null, null];
          _this.resolving = false;
          _this.terminal = false;
          return _this;
        }
        var _proto = T1PaintBuildThreeDProof.prototype;
        _proto.onLoad = function onLoad() {
          var _this2 = this;
          view.setDesignResolutionSize(390, 844, ResolutionPolicy.SHOW_ALL);
          view.resizeWithBrowserSize(true);
          this.setAutomationStatus('loading');
          resources.load('materials/t1-standard', Material, function (error, material) {
            if (error || !material) {
              console.error('[T1-PaintBuild-3D] Failed to load project standard material', error);
              _this2.setAutomationStatus('asset-error');
              return;
            }
            _this2.standardMaterial = material;
            _this2.createWorld();
            _this2.createOverlay();
            _this2.createBlueprint();
            _this2.createFinalBunny();
            _this2.createPaintTrays();
            _this2.updateBlueprintPreview();
            _this2.status.string = '选择颜料盒，真实 3D 方块会自动拼到当前层';
            _this2.setAutomationStatus('ready');
          });
        };
        _proto.createWorld = function createWorld() {
          var scene = director.getScene();
          if (scene) {
            scene.globals.ambient.skyLightingColor = new Color(230, 235, 255, 255);
            scene.globals.ambient.groundLightingColor = new Color(190, 203, 228, 255);
            scene.globals.ambient.skyIllum = 30000;
          }
          var cameraNode = new Node('PaintBuildPerspectiveCamera');
          cameraNode.setPosition(0.75, 1.62, 9.4);
          cameraNode.lookAt(new Vec3(0, 1.05, 0));
          this.node.addChild(cameraNode);
          var camera = cameraNode.addComponent(Camera);
          camera.projection = Camera.ProjectionType.PERSPECTIVE;
          camera.fov = 38;
          camera.near = 0.1;
          camera.far = 100;
          camera.priority = 0;
          camera.visibility = Layers.Enum.DEFAULT;
          camera.clearColor = new Color(230, 229, 246, 255);
          var keyLightNode = new Node('PaintBuildKeyLight');
          keyLightNode.setPosition(-3.6, 5.8, 5.4);
          keyLightNode.lookAt(new Vec3(0, 1.1, 0));
          this.node.addChild(keyLightNode);
          var keyLight = keyLightNode.addComponent(DirectionalLight);
          keyLight.color = new Color(255, 242, 222, 255);
          keyLight.illuminance = 76000;
          var fillLightNode = new Node('PaintBuildFillLight');
          fillLightNode.setPosition(3.2, 3.8, 3.6);
          fillLightNode.lookAt(new Vec3(0, 1.25, 0));
          this.node.addChild(fillLightNode);
          var fillLight = fillLightNode.addComponent(DirectionalLight);
          fillLight.color = new Color(198, 220, 255, 255);
          fillLight.illuminance = 32000;
          this.addMesh(this.node, 'PaintBuildGround', 'plane', new Vec3(0, -1.2, 0), new Vec3(7.2, 1, 7.2), new Color(204, 218, 235, 255), 0.95);
          this.addMesh(this.node, 'PaintBuildPedestal', 'box', new Vec3(0, -1.02, 0), new Vec3(4.1, 0.28, 2.2), new Color(248, 248, 252, 255), 0.82);
        };
        _proto.createOverlay = function createOverlay() {
          var _this3 = this;
          this.canvasNode = new Node('PaintBuild3DOverlay');
          this.canvasNode.layer = Layers.Enum.UI_2D;
          this.canvasNode.setPosition(195, 422, 0);
          this.node.addChild(this.canvasNode);
          this.canvasNode.addComponent(UITransform).setContentSize(390, 844);
          var canvas = this.canvasNode.addComponent(Canvas);
          var cameraNode = new Node('PaintBuild3DOverlayCamera');
          cameraNode.layer = Layers.Enum.UI_2D;
          cameraNode.setPosition(0, 0, 1000);
          this.canvasNode.addChild(cameraNode);
          var camera = cameraNode.addComponent(Camera);
          camera.projection = Camera.ProjectionType.ORTHO;
          camera.orthoHeight = 422;
          camera.near = 1;
          camera.far = 2000;
          camera.priority = 10;
          camera.visibility = Layers.Enum.UI_2D;
          camera.clearFlags = Camera.ClearFlag.DEPTH_ONLY;
          canvas.cameraComponent = camera;
          this.addPanel(this.canvasNode, 'HeaderCard', 0, 348, 352, 92, 30, new Color(255, 255, 255, 230));
          this.addLabel(this.canvasNode, '方案 B · 真实 Cocos 3D', 0, 368, 22, new Color(40, 46, 68, 255), 330, true);
          this.addLabel(this.canvasNode, '方块与动物均为 Mesh · PBR 材质 · 实时灯光', 0, 336, 12, new Color(90, 100, 129, 255), 330);
          this.addPanel(this.canvasNode, 'ProgressChip', 0, 276, 222, 30, 15, new Color(255, 255, 255, 220));
          this.progressLabel = this.addLabel(this.canvasNode, '从脚开始 · 当前第 1 / 6 层', 0, 276, 12, new Color(66, 106, 152, 255), 210, true);
          this.addPanel(this.canvasNode, 'StatusCard', 0, -147, 350, 44, 20, new Color(255, 255, 255, 222));
          this.status = this.addLabel(this.canvasNode, '正在创建真实 3D 方块和动物…', 0, -147, 14, new Color(60, 70, 98, 255), 330, true);
          this.slotPositions.forEach(function (position, index) {
            _this3.addPanel(_this3.canvasNode, "PaintSlot3D" + index, position.x, position.y, 132, 64, 20, new Color(255, 255, 255, 225));
            _this3.slotLabels[index] = _this3.addLabel(_this3.canvasNode, '空位', position.x, position.y, 14, new Color(134, 139, 158, 255), 118, true);
          });
          this.addPanel(this.canvasNode, 'ProofChip', 0, -389, 352, 28, 14, new Color(255, 255, 255, 215));
          this.addLabel(this.canvasNode, '真实 3D 技术样片 · 不冒充正式模型资产质量', 0, -389, 11, new Color(91, 101, 126, 255), 338);
        };
        _proto.createBlueprint = function createBlueprint() {
          var _this4 = this;
          this.blockRoot = new Node('PaintBlockAnimal3D');
          this.blockRoot.setPosition(0, 0.95, 0.2);
          this.node.addChild(this.blockRoot);
          var layout = [{
            row: 0,
            x: -60,
            paintId: 'gold'
          }, {
            row: 0,
            x: -30,
            paintId: 'gold'
          }, {
            row: 0,
            x: 30,
            paintId: 'gold'
          }, {
            row: 0,
            x: 60,
            paintId: 'gold'
          }, {
            row: 1,
            x: -30,
            paintId: 'coral'
          }, {
            row: 1,
            x: 0,
            paintId: 'coral'
          }, {
            row: 1,
            x: 30,
            paintId: 'coral'
          }, {
            row: 2,
            x: -45,
            paintId: 'sky'
          }, {
            row: 2,
            x: -15,
            paintId: 'gold'
          }, {
            row: 2,
            x: 15,
            paintId: 'gold'
          }, {
            row: 2,
            x: 45,
            paintId: 'sky'
          }, {
            row: 3,
            x: -60,
            paintId: 'coral'
          }, {
            row: 3,
            x: -30,
            paintId: 'coral'
          }, {
            row: 3,
            x: 0,
            paintId: 'coral'
          }, {
            row: 3,
            x: 30,
            paintId: 'coral'
          }, {
            row: 3,
            x: 60,
            paintId: 'coral'
          }, {
            row: 4,
            x: -30,
            paintId: 'sky'
          }, {
            row: 4,
            x: 30,
            paintId: 'sky'
          }, {
            row: 5,
            x: -30,
            paintId: 'sky'
          }, {
            row: 5,
            x: 30,
            paintId: 'sky'
          }];
          layout.forEach(function (entry, index) {
            var definition = _this4.getDefinition(entry.paintId);
            var position = new Vec3(entry.x / 90, -0.31 + entry.row * 0.29, 0);
            var node = _this4.addMesh(_this4.blockRoot, "PaintCube" + index, 'box', position, new Vec3(0.26, 0.26, 0.22), new Color(definition.color.r, definition.color.g, definition.color.b, 64), 0.38, true);
            node.setRotationFromEuler(-8, -12, 0);
            _this4.cells.push({
              row: entry.row,
              paintId: entry.paintId,
              position: position,
              node: node,
              completed: false
            });
          });
        };
        _proto.createFinalBunny = function createFinalBunny() {
          this.finalBunny = new Node('FinalProceduralPaintBunny');
          this.finalBunny.setPosition(0, 0.65, 0.18);
          this.node.addChild(this.finalBunny);
          var cream = new Color(242, 224, 190, 255);
          var creamLight = new Color(255, 246, 220, 255);
          var cocoa = new Color(70, 43, 42, 255);
          var pink = new Color(235, 145, 154, 255);
          this.addMesh(this.finalBunny, 'Body', 'sphere', new Vec3(0, 0.38, 0), new Vec3(1.58, 1.95, 1.2), cream, 0.86);
          this.addMesh(this.finalBunny, 'Belly', 'sphere', new Vec3(0, 0.34, 0.58), new Vec3(0.98, 1.28, 0.32), creamLight, 0.93);
          this.addMesh(this.finalBunny, 'Head', 'sphere', new Vec3(0, 1.77, 0), new Vec3(1.8, 1.62, 1.44), cream, 0.83);
          var leftEar = this.addMesh(this.finalBunny, 'LeftEar', 'sphere', new Vec3(-0.56, 3.02, 0), new Vec3(0.54, 1.58, 0.5), cream, 0.86);
          leftEar.setRotationFromEuler(0, 0, 8);
          var rightEar = this.addMesh(this.finalBunny, 'RightEar', 'sphere', new Vec3(0.56, 3.02, 0), new Vec3(0.54, 1.58, 0.5), cream, 0.86);
          rightEar.setRotationFromEuler(0, 0, -8);
          var leftInner = this.addMesh(this.finalBunny, 'LeftInnerEar', 'sphere', new Vec3(-0.56, 3.03, 0.27), new Vec3(0.28, 1.12, 0.13), pink, 0.9);
          leftInner.setRotationFromEuler(0, 0, 8);
          var rightInner = this.addMesh(this.finalBunny, 'RightInnerEar', 'sphere', new Vec3(0.56, 3.03, 0.27), new Vec3(0.28, 1.12, 0.13), pink, 0.9);
          rightInner.setRotationFromEuler(0, 0, -8);
          this.addMesh(this.finalBunny, 'LeftEye', 'sphere', new Vec3(-0.4, 1.92, 0.7), new Vec3(0.31, 0.42, 0.18), cocoa, 0.28);
          this.addMesh(this.finalBunny, 'RightEye', 'sphere', new Vec3(0.4, 1.92, 0.7), new Vec3(0.31, 0.42, 0.18), cocoa, 0.28);
          this.addMesh(this.finalBunny, 'LeftEyeShine', 'sphere', new Vec3(-0.34, 2.03, 0.8), new Vec3(0.08, 0.11, 0.05), Color.WHITE, 0.18);
          this.addMesh(this.finalBunny, 'RightEyeShine', 'sphere', new Vec3(0.46, 2.03, 0.8), new Vec3(0.08, 0.11, 0.05), Color.WHITE, 0.18);
          this.addMesh(this.finalBunny, 'LeftMuzzle', 'sphere', new Vec3(-0.19, 1.57, 0.73), new Vec3(0.43, 0.31, 0.18), creamLight, 0.94);
          this.addMesh(this.finalBunny, 'RightMuzzle', 'sphere', new Vec3(0.19, 1.57, 0.73), new Vec3(0.43, 0.31, 0.18), creamLight, 0.94);
          this.addMesh(this.finalBunny, 'Nose', 'sphere', new Vec3(0, 1.67, 0.84), new Vec3(0.2, 0.14, 0.11), pink, 0.52);
          var leftArm = this.addMesh(this.finalBunny, 'LeftArm', 'sphere', new Vec3(-0.48, 0.5, 0.6), new Vec3(0.45, 0.92, 0.4), cream, 0.88);
          leftArm.setRotationFromEuler(0, 0, -16);
          var rightArm = this.addMesh(this.finalBunny, 'RightArm', 'sphere', new Vec3(0.48, 0.5, 0.6), new Vec3(0.45, 0.92, 0.4), cream, 0.88);
          rightArm.setRotationFromEuler(0, 0, 16);
          this.addMesh(this.finalBunny, 'LeftFoot', 'sphere', new Vec3(-0.56, -0.56, 0.28), new Vec3(0.78, 0.45, 0.92), cream, 0.88);
          this.addMesh(this.finalBunny, 'RightFoot', 'sphere', new Vec3(0.56, -0.56, 0.28), new Vec3(0.78, 0.45, 0.92), cream, 0.88);
          this.finalBunny.setScale(0.01, 0.01, 0.01);
          this.finalBunny.active = false;
        };
        _proto.createPaintTrays = function createPaintTrays() {
          var _this5 = this;
          var homes = [new Vec3(-122, -315, 0), new Vec3(0, -315, 0), new Vec3(122, -315, 0)];
          this.paintDefinitions.forEach(function (definition, index) {
            var home = homes[index];
            var node = _this5.createPaintTrayNode(definition, home);
            var button = node.addComponent(Button);
            var opacity = node.addComponent(UIOpacity);
            var countLabel = node.getChildByName('CountPanel').getChildByName('Count').getComponent(Label);
            var tray = {
              definition: definition,
              node: node,
              button: button,
              opacity: opacity,
              countLabel: countLabel,
              home: home.clone(),
              remaining: definition.total,
              selected: false,
              slotIndex: -1
            };
            node.on(Button.EventType.CLICK, function () {
              return _this5.selectTray(tray);
            }, _this5);
            _this5.trays.push(tray);
          });
        };
        _proto.selectTray = /*#__PURE__*/function () {
          var _selectTray = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(tray) {
            var slotIndex;
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  if (!(this.resolving || this.terminal || tray.selected)) {
                    _context.next = 2;
                    break;
                  }
                  return _context.abrupt("return");
                case 2:
                  slotIndex = this.activeSlots.findIndex(function (active) {
                    return active === null;
                  });
                  if (!(slotIndex < 0)) {
                    _context.next = 5;
                    break;
                  }
                  return _context.abrupt("return");
                case 5:
                  tray.selected = true;
                  tray.slotIndex = slotIndex;
                  tray.button.interactable = false;
                  this.activeSlots[slotIndex] = tray;
                  this.updateSlotLabels();
                  this.setAutomationStatus('running');
                  this.status.string = tray.definition.name + "\u8FDB\u5165\u989C\u6599\u4F4D\uFF0C3D \u65B9\u5757\u81EA\u52A8\u5BFB\u627E\u76EE\u6807\u2026";
                  tween(tray.node).to(0.22, {
                    position: this.slotPositions[slotIndex],
                    scale: new Vec3(0.92, 0.92, 1)
                  }, {
                    easing: 'quadOut'
                  }).start();
                  _context.next = 15;
                  return this.wait(0.26);
                case 15:
                  _context.next = 17;
                  return this.resolveAvailableCells();
                case 17:
                case "end":
                  return _context.stop();
              }
            }, _callee, this);
          }));
          function selectTray(_x) {
            return _selectTray.apply(this, arguments);
          }
          return selectTray;
        }();
        _proto.resolveAvailableCells = /*#__PURE__*/function () {
          var _resolveAvailableCells = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
            var _this6 = this;
            var _loop, _ret, currentRow, neededNames;
            return _regeneratorRuntime().wrap(function _callee2$(_context3) {
              while (1) switch (_context3.prev = _context3.next) {
                case 0:
                  if (!(this.resolving || this.terminal)) {
                    _context3.next = 2;
                    break;
                  }
                  return _context3.abrupt("return");
                case 2:
                  this.resolving = true;
                  _loop = /*#__PURE__*/_regeneratorRuntime().mark(function _loop() {
                    var row, target, tray, definition;
                    return _regeneratorRuntime().wrap(function _loop$(_context2) {
                      while (1) switch (_context2.prev = _context2.next) {
                        case 0:
                          row = _this6.getCurrentRow();
                          if (!(row < 0)) {
                            _context2.next = 6;
                            break;
                          }
                          _this6.resolving = false;
                          _context2.next = 5;
                          return _this6.completeAnimal();
                        case 5:
                          return _context2.abrupt("return", {
                            v: void 0
                          });
                        case 6:
                          target = _this6.cells.find(function (cell) {
                            return !cell.completed && cell.row === row && _this6.findActiveTray(cell.paintId);
                          });
                          if (target) {
                            _context2.next = 9;
                            break;
                          }
                          return _context2.abrupt("return", 0);
                        case 9:
                          tray = _this6.findActiveTray(target.paintId);
                          _this6.status.string = tray.definition.name + "\u771F\u5B9E\u65B9\u5757\u81EA\u52A8\u62FC\u5230\u7B2C " + (row + 1) + " \u5C42";
                          _context2.next = 13;
                          return _this6.flyPaintBlock(tray, target);
                        case 13:
                          target.completed = true;
                          definition = _this6.getDefinition(target.paintId);
                          target.node.getComponent(MeshRenderer).setSharedMaterial(_this6.getMaterial(definition.color, 0.32), 0);
                          target.node.setScale(0.12, 0.12, 0.1);
                          tween(target.node).to(0.18, {
                            scale: new Vec3(0.26, 0.26, 0.22)
                          }, {
                            easing: 'backOut'
                          }).start();
                          tray.remaining -= 1;
                          tray.countLabel.string = String(tray.remaining);
                          _this6.updateSlotLabels();
                          _this6.updateBlueprintPreview();
                          if (!(tray.remaining === 0)) {
                            _context2.next = 25;
                            break;
                          }
                          _context2.next = 25;
                          return _this6.releaseTray(tray);
                        case 25:
                          _context2.next = 27;
                          return _this6.wait(0.05);
                        case 27:
                        case "end":
                          return _context2.stop();
                      }
                    }, _loop);
                  });
                case 4:
                  if (this.terminal) {
                    _context3.next = 13;
                    break;
                  }
                  return _context3.delegateYield(_loop(), "t0", 6);
                case 6:
                  _ret = _context3.t0;
                  if (!(_ret === 0)) {
                    _context3.next = 9;
                    break;
                  }
                  return _context3.abrupt("break", 13);
                case 9:
                  if (!_ret) {
                    _context3.next = 11;
                    break;
                  }
                  return _context3.abrupt("return", _ret.v);
                case 11:
                  _context3.next = 4;
                  break;
                case 13:
                  this.resolving = false;
                  if (!(this.getCurrentRow() < 0)) {
                    _context3.next = 18;
                    break;
                  }
                  _context3.next = 17;
                  return this.completeAnimal();
                case 17:
                  return _context3.abrupt("return");
                case 18:
                  currentRow = this.getCurrentRow();
                  neededNames = Array.from(new Set(this.cells.filter(function (cell) {
                    return !cell.completed && cell.row === currentRow;
                  }).map(function (cell) {
                    return _this6.getDefinition(cell.paintId).name;
                  })));
                  if (!this.activeSlots.every(Boolean)) {
                    _context3.next = 24;
                    break;
                  }
                  _context3.next = 23;
                  return this.failBuild(neededNames.join(' / '));
                case 23:
                  return _context3.abrupt("return");
                case 24:
                  this.status.string = "\u7B2C " + (currentRow + 1) + " \u5C42\u8FD8\u9700\u8981 " + neededNames.join(' / ') + "\uFF0C\u672A\u7528\u5B8C\u989C\u6599\u7EE7\u7EED\u5360\u4F4D";
                  this.setAutomationStatus('waiting');
                case 26:
                case "end":
                  return _context3.stop();
              }
            }, _callee2, this);
          }));
          function resolveAvailableCells() {
            return _resolveAvailableCells.apply(this, arguments);
          }
          return resolveAvailableCells;
        }();
        _proto.flyPaintBlock = function flyPaintBlock(tray, target) {
          var _this7 = this;
          return new Promise(function (resolve) {
            var start = _this7.slotWorldPositions[tray.slotIndex];
            var flying = _this7.addMesh(_this7.node, 'FlyingPaintCube3D', 'box', start, new Vec3(0.32, 0.32, 0.32), tray.definition.color, 0.26);
            var destination = new Vec3(target.position.x + _this7.blockRoot.position.x, target.position.y + _this7.blockRoot.position.y, target.position.z + _this7.blockRoot.position.z + 0.06);
            tween(flying).to(0.14, {
              position: new Vec3((start.x + destination.x) * 0.5, destination.y + 0.65, 1.2),
              eulerAngles: new Vec3(30, 55, 20)
            }, {
              easing: 'quadOut'
            }).to(0.2, {
              position: destination,
              scale: new Vec3(0.42, 0.42, 0.34),
              eulerAngles: Vec3.ZERO
            }, {
              easing: 'quadIn'
            }).call(function () {
              flying.destroy();
              resolve();
            }).start();
          });
        };
        _proto.releaseTray = /*#__PURE__*/function () {
          var _releaseTray = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(tray) {
            var slotIndex;
            return _regeneratorRuntime().wrap(function _callee3$(_context4) {
              while (1) switch (_context4.prev = _context4.next) {
                case 0:
                  slotIndex = tray.slotIndex;
                  this.activeSlots[slotIndex] = null;
                  tray.slotIndex = -1;
                  this.updateSlotLabels();
                  tween(tray.node).to(0.14, {
                    scale: new Vec3(0.7, 0.7, 1)
                  }, {
                    easing: 'quadIn'
                  }).start();
                  tween(tray.opacity).to(0.14, {
                    opacity: 0
                  }).start();
                  _context4.next = 8;
                  return this.wait(0.16);
                case 8:
                  tray.node.active = false;
                case 9:
                case "end":
                  return _context4.stop();
              }
            }, _callee3, this);
          }));
          function releaseTray(_x2) {
            return _releaseTray.apply(this, arguments);
          }
          return releaseTray;
        }();
        _proto.completeAnimal = /*#__PURE__*/function () {
          var _completeAnimal = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
            return _regeneratorRuntime().wrap(function _callee4$(_context5) {
              while (1) switch (_context5.prev = _context5.next) {
                case 0:
                  if (!this.terminal) {
                    _context5.next = 2;
                    break;
                  }
                  return _context5.abrupt("return");
                case 2:
                  this.terminal = true;
                  this.setAutomationStatus('transforming');
                  this.progressLabel.string = '6 / 6 层完成 · 真实方块正在变成 3D 动物';
                  this.status.string = '拼完了！3D 方块正在唤醒真正的小动物…';
                  Tween.stopAllByTarget(this.blockRoot);
                  tween(this.blockRoot).to(0.18, {
                    scale: new Vec3(1.08, 0.92, 1.08),
                    eulerAngles: new Vec3(0, 12, -2)
                  }, {
                    easing: 'quadOut'
                  }).to(0.25, {
                    scale: new Vec3(0.72, 1.12, 0.72),
                    eulerAngles: new Vec3(0, -18, 3)
                  }, {
                    easing: 'quadInOut'
                  }).to(0.32, {
                    scale: new Vec3(0.02, 0.02, 0.02),
                    eulerAngles: new Vec3(0, 120, 0)
                  }, {
                    easing: 'quadIn'
                  }).start();
                  this.finalBunny.active = true;
                  this.finalBunny.setScale(0.01, 0.01, 0.01);
                  tween(this.finalBunny).delay(0.4).to(0.48, {
                    scale: new Vec3(0.56, 0.5, 0.56),
                    eulerAngles: new Vec3(0, -6, -1.5)
                  }, {
                    easing: 'backOut'
                  }).to(0.22, {
                    scale: new Vec3(0.52, 0.52, 0.52),
                    eulerAngles: Vec3.ZERO
                  }, {
                    easing: 'sineOut'
                  }).start();
                  this.createCelebration();
                  _context5.next = 14;
                  return this.wait(1.15);
                case 14:
                  this.status.string = '完成：真实 3D 方块从脚拼起，最终变成 3D 小动物';
                  this.setAutomationStatus('passed');
                  _context5.next = 18;
                  return this.wait(3.0);
                case 18:
                  this.resetSample();
                case 19:
                case "end":
                  return _context5.stop();
              }
            }, _callee4, this);
          }));
          function completeAnimal() {
            return _completeAnimal.apply(this, arguments);
          }
          return completeAnimal;
        }();
        _proto.failBuild = /*#__PURE__*/function () {
          var _failBuild = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(needed) {
            var _this8 = this;
            return _regeneratorRuntime().wrap(function _callee5$(_context6) {
              while (1) switch (_context6.prev = _context6.next) {
                case 0:
                  if (!this.terminal) {
                    _context6.next = 2;
                    break;
                  }
                  return _context6.abrupt("return");
                case 2:
                  this.terminal = true;
                  this.status.string = "\u4E24\u4E2A\u989C\u6599\u4F4D\u90FD\u88AB\u7B49\u5F85\u989C\u8272\u5360\u6EE1\uFF1B\u5F53\u524D\u811A\u5C42\u9700\u8981 " + needed;
                  this.progressLabel.string = '无法继续 · 本次闯关失败';
                  this.setAutomationStatus('failed');
                  this.activeSlots.forEach(function (tray) {
                    if (!tray) return;
                    tween(tray.node).to(0.08, {
                      position: tray.node.position.clone().add(new Vec3(-6, 0, 0))
                    }).to(0.08, {
                      position: tray.node.position.clone().add(new Vec3(6, 0, 0))
                    }).to(0.08, {
                      position: _this8.slotPositions[tray.slotIndex]
                    }).start();
                  });
                  tween(this.blockRoot).to(0.1, {
                    position: this.blockRoot.position.clone().add(new Vec3(-0.08, 0, 0))
                  }).to(0.1, {
                    position: this.blockRoot.position.clone().add(new Vec3(0.16, 0, 0))
                  }).to(0.1, {
                    position: new Vec3(0, 0.95, 0.2)
                  }).start();
                  _context6.next = 10;
                  return this.wait(2.4);
                case 10:
                  this.resetSample();
                case 11:
                case "end":
                  return _context6.stop();
              }
            }, _callee5, this);
          }));
          function failBuild(_x3) {
            return _failBuild.apply(this, arguments);
          }
          return failBuild;
        }();
        _proto.resetSample = function resetSample() {
          Tween.stopAllByTarget(this.blockRoot);
          Tween.stopAllByTarget(this.finalBunny);
          this.blockRoot.active = true;
          this.blockRoot.setPosition(0, 0.95, 0.2);
          this.blockRoot.setScale(Vec3.ONE);
          this.blockRoot.setRotationFromEuler(0, 0, 0);
          this.finalBunny.active = false;
          this.finalBunny.setScale(0.01, 0.01, 0.01);
          this.finalBunny.setRotationFromEuler(0, 0, 0);
          this.cells.forEach(function (cell) {
            cell.completed = false;
            cell.node.setScale(0.26, 0.26, 0.22);
          });
          this.activeSlots = [null, null];
          this.trays.forEach(function (tray) {
            Tween.stopAllByTarget(tray.node);
            Tween.stopAllByTarget(tray.opacity);
            tray.remaining = tray.definition.total;
            tray.countLabel.string = String(tray.remaining);
            tray.selected = false;
            tray.slotIndex = -1;
            tray.node.active = true;
            tray.node.setPosition(tray.home);
            tray.node.setScale(Vec3.ONE);
            tray.opacity.opacity = 255;
            tray.button.interactable = true;
          });
          this.resolving = false;
          this.terminal = false;
          this.updateSlotLabels();
          this.updateBlueprintPreview();
          this.status.string = '选择颜料盒，真实 3D 方块会自动拼到当前层';
          this.setAutomationStatus('ready');
        };
        _proto.updateBlueprintPreview = function updateBlueprintPreview() {
          var _this9 = this;
          var currentRow = this.getCurrentRow();
          this.cells.forEach(function (cell) {
            var definition = _this9.getDefinition(cell.paintId);
            var renderer = cell.node.getComponent(MeshRenderer);
            if (cell.completed) {
              renderer.setSharedMaterial(_this9.getMaterial(definition.color, 0.32), 0);
            } else {
              var alpha = cell.row === currentRow ? 175 : 52;
              renderer.setSharedMaterial(_this9.getMaterial(new Color(definition.color.r, definition.color.g, definition.color.b, alpha), 0.42, true), 0);
            }
          });
          if (currentRow >= 0) {
            this.progressLabel.string = "\u4ECE\u811A\u5F00\u59CB \xB7 \u5F53\u524D\u7B2C " + (currentRow + 1) + " / 6 \u5C42";
          }
        };
        _proto.updateSlotLabels = function updateSlotLabels() {
          var _this10 = this;
          this.slotLabels.forEach(function (label, index) {
            var tray = _this10.activeSlots[index];
            label.string = tray ? tray.definition.name + " \xB7 \u5269 " + tray.remaining : '空位';
            label.color = tray ? tray.definition.deep : new Color(134, 139, 158, 255);
          });
        };
        _proto.getCurrentRow = function getCurrentRow() {
          var incomplete = this.cells.filter(function (cell) {
            return !cell.completed;
          });
          return incomplete.length ? Math.min.apply(Math, incomplete.map(function (cell) {
            return cell.row;
          })) : -1;
        };
        _proto.findActiveTray = function findActiveTray(paintId) {
          return this.activeSlots.find(function (tray) {
            return Boolean(tray && tray.definition.id === paintId && tray.remaining > 0);
          });
        };
        _proto.getDefinition = function getDefinition(paintId) {
          return this.paintDefinitions.find(function (definition) {
            return definition.id === paintId;
          });
        };
        _proto.createCelebration = function createCelebration() {
          var _this11 = this;
          var colors = this.paintDefinitions.map(function (definition) {
            return definition.color;
          });
          var _loop2 = function _loop2() {
            var angle = Math.PI * 2 * index / 18;
            var cube = _this11.addMesh(_this11.node, "PaintCelebrationCube" + index, 'box', new Vec3(0, 1.1, 0.9), new Vec3(0.14, 0.14, 0.14), colors[index % colors.length], 0.3);
            tween(cube).delay(0.4).by(0.8, {
              position: new Vec3(Math.cos(angle) * (1.8 + index % 3 * 0.18), Math.sin(angle) * (1.7 + index % 2 * 0.2), 0.5),
              scale: new Vec3(-0.11, -0.11, -0.11),
              eulerAngles: new Vec3(120, 150, 90)
            }, {
              easing: 'quadOut'
            }).call(function () {
              return cube.destroy();
            }).start();
          };
          for (var index = 0; index < 18; index += 1) {
            _loop2();
          }
        };
        _proto.addMesh = function addMesh(parent, name, shape, position, scale, color, roughness, transparent) {
          if (transparent === void 0) {
            transparent = false;
          }
          var node = new Node(name);
          node.setPosition(position);
          node.setScale(scale);
          parent.addChild(node);
          var renderer = node.addComponent(MeshRenderer);
          renderer.setSharedMaterial(this.getMaterial(color, roughness, transparent), 0);
          renderer.mesh = this.getMesh(shape);
          return node;
        };
        _proto.getMesh = function getMesh(shape) {
          var cached = this.meshes.get(shape);
          if (cached) return cached;
          var geometry = shape === 'sphere' ? primitives.sphere(0.5, {
            segments: 24
          }) : shape === 'box' ? primitives.box({
            width: 1,
            height: 1,
            length: 1
          }) : primitives.plane({
            width: 1,
            length: 1,
            widthSegments: 1,
            lengthSegments: 1
          });
          var mesh = utils.createMesh(geometry);
          this.meshes.set(shape, mesh);
          return mesh;
        };
        _proto.getMaterial = function getMaterial(color, roughness, transparent) {
          if (transparent === void 0) {
            transparent = false;
          }
          var key = color.r + "-" + color.g + "-" + color.b + "-" + color.a + "-" + roughness + "-" + transparent;
          var cached = this.materials.get(key);
          if (cached) return cached;
          var material = new Material();
          material.copy(this.standardMaterial, {
            technique: transparent ? 1 : 0
          });
          if (!material.passes || material.passes.length === 0) {
            throw new Error("PaintBuild 3D material has no render passes (technique=" + (transparent ? 1 : 0) + ")");
          }
          material.setProperty('mainColor', color);
          material.setProperty('roughness', roughness);
          material.setProperty('metallic', 0);
          material.setProperty('specularIntensity', transparent ? 0.65 : 0.38);
          this.materials.set(key, material);
          return material;
        };
        _proto.createPaintTrayNode = function createPaintTrayNode(definition, home) {
          var node = new Node("PaintTray3D:" + definition.id);
          node.layer = Layers.Enum.UI_2D;
          node.setPosition(home);
          this.canvasNode.addChild(node);
          node.addComponent(UITransform).setContentSize(108, 68);
          var graphics = node.addComponent(Graphics);
          graphics.fillColor = definition.color;
          graphics.roundRect(-52, -31, 104, 62, 18);
          graphics.fill();
          graphics.lineWidth = 3;
          graphics.strokeColor = definition.deep;
          graphics.stroke();
          graphics.fillColor = new Color(255, 255, 255, 95);
          graphics.roundRect(-43, 13, 54, 8, 4);
          graphics.fill();
          this.addLabel(node, definition.name, -8, -1, 13, Color.WHITE, 72, true);
          var countNode = this.addPanel(node, 'CountPanel', 36, -1, 30, 30, 15, Color.WHITE);
          var countLabel = this.addLabel(countNode, String(definition.total), 0, 0, 14, definition.deep, 28, true);
          countLabel.node.name = 'Count';
          return node;
        };
        _proto.addPanel = function addPanel(parent, name, x, y, width, height, radius, color) {
          var node = new Node(name);
          node.layer = Layers.Enum.UI_2D;
          node.setPosition(x, y, 0);
          parent.addChild(node);
          node.addComponent(UITransform).setContentSize(width, height);
          var graphics = node.addComponent(Graphics);
          graphics.fillColor = color;
          graphics.roundRect(-width / 2, -height / 2, width, height, radius);
          graphics.fill();
          return node;
        };
        _proto.addLabel = function addLabel(parent, text, x, y, fontSize, color, width, bold) {
          if (bold === void 0) {
            bold = false;
          }
          var node = new Node("Label:" + text);
          node.layer = Layers.Enum.UI_2D;
          node.setPosition(x, y, 0);
          parent.addChild(node);
          node.addComponent(UITransform).setContentSize(width, fontSize * 1.9);
          var label = node.addComponent(Label);
          label.string = text;
          label.fontSize = fontSize;
          label.lineHeight = Math.round(fontSize * 1.3);
          label.color = color;
          label.isBold = bold;
          label.horizontalAlign = HorizontalTextAlignment.CENTER;
          label.verticalAlign = VerticalTextAlignment.CENTER;
          label.overflow = Label.Overflow.SHRINK;
          return label;
        };
        _proto.wait = function wait(seconds) {
          var _this12 = this;
          return new Promise(function (resolve) {
            return _this12.scheduleOnce(resolve, seconds);
          });
        };
        _proto.setAutomationStatus = function setAutomationStatus(status) {
          if (typeof document !== 'undefined') {
            document.documentElement.dataset.t1Status = status;
            document.documentElement.dataset.renderMode = 'paint-block-build-3d';
            document.documentElement.dataset.visualDimension = '3d';
          }
        };
        return T1PaintBuildThreeDProof;
      }(Component)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/T1ThreeDProof.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _inheritsLoose, _asyncToGenerator, _regeneratorRuntime, cclegacy, _decorator, view, ResolutionPolicy, resources, Material, director, Color, Node, Vec3, Camera, Layers, DirectionalLight, UITransform, Canvas, Button, tween, Tween, MeshRenderer, primitives, utils, UIOpacity, Graphics, Label, HorizontalTextAlignment, VerticalTextAlignment, Component;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
      _asyncToGenerator = module.asyncToGenerator;
      _regeneratorRuntime = module.regeneratorRuntime;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      view = module.view;
      ResolutionPolicy = module.ResolutionPolicy;
      resources = module.resources;
      Material = module.Material;
      director = module.director;
      Color = module.Color;
      Node = module.Node;
      Vec3 = module.Vec3;
      Camera = module.Camera;
      Layers = module.Layers;
      DirectionalLight = module.DirectionalLight;
      UITransform = module.UITransform;
      Canvas = module.Canvas;
      Button = module.Button;
      tween = module.tween;
      Tween = module.Tween;
      MeshRenderer = module.MeshRenderer;
      primitives = module.primitives;
      utils = module.utils;
      UIOpacity = module.UIOpacity;
      Graphics = module.Graphics;
      Label = module.Label;
      HorizontalTextAlignment = module.HorizontalTextAlignment;
      VerticalTextAlignment = module.VerticalTextAlignment;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "c2e171qn0NP6J0oN6+Kjl2R", "T1ThreeDProof", undefined);
      var ccclass = _decorator.ccclass;
      var T1ThreeDProof = exports('T1ThreeDProof', (_dec = ccclass('T1ThreeDProof'), _dec(_class = /*#__PURE__*/function (_Component) {
        _inheritsLoose(T1ThreeDProof, _Component);
        function T1ThreeDProof() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _this.coral = new Color(255, 127, 114, 255);
          _this.coralDeep = new Color(196, 65, 62, 255);
          _this.sky = new Color(101, 177, 231, 255);
          _this.gold = new Color(247, 193, 71, 255);
          _this.cream = new Color(240, 222, 187, 255);
          _this.creamLight = new Color(255, 244, 218, 255);
          _this.cocoa = new Color(73, 45, 42, 255);
          _this.pink = new Color(236, 151, 151, 255);
          _this.meshes = new Map();
          _this.materials = new Map();
          _this.standardMaterial = void 0;
          _this.canvasNode = void 0;
          _this.modelRoot = void 0;
          _this.bucketNode = void 0;
          _this.bucketButton = void 0;
          _this.bucketOpacity = void 0;
          _this.bucketCount = void 0;
          _this.slotLabel = void 0;
          _this.status = void 0;
          _this.stains = [];
          _this.busy = false;
          return _this;
        }
        var _proto = T1ThreeDProof.prototype;
        _proto.onLoad = function onLoad() {
          var _this2 = this;
          view.setDesignResolutionSize(390, 844, ResolutionPolicy.SHOW_ALL);
          view.resizeWithBrowserSize(true);
          this.setAutomationStatus('loading');
          resources.load('materials/t1-standard', Material, function (error, material) {
            if (error || !material) {
              console.error('[T1-3D] Failed to load project standard material', error);
              _this2.setAutomationStatus('asset-error');
              return;
            }
            _this2.standardMaterial = material;
            _this2.createWorld();
            _this2.createBunny();
            _this2.createOverlay();
            _this2.startBreathing();
            _this2.setAutomationStatus('ready');
          });
        };
        _proto.createWorld = function createWorld() {
          var scene = director.getScene();
          if (scene) {
            scene.globals.ambient.skyLightingColor = new Color(224, 239, 250, 255);
            scene.globals.ambient.groundLightingColor = new Color(180, 202, 206, 255);
            scene.globals.ambient.skyIllum = 26000;
          }
          var cameraNode = new Node('PerspectiveCamera');
          cameraNode.setPosition(0, 1.55, 9.2);
          cameraNode.lookAt(new Vec3(0, 1.45, 0));
          this.node.addChild(cameraNode);
          var camera = cameraNode.addComponent(Camera);
          camera.projection = Camera.ProjectionType.PERSPECTIVE;
          camera.fov = 38;
          camera.near = 0.1;
          camera.far = 100;
          camera.priority = 0;
          camera.visibility = Layers.Enum.DEFAULT;
          camera.clearColor = new Color(220, 241, 245, 255);
          var lightNode = new Node('KeyLight');
          lightNode.setPosition(-3.2, 5.4, 5.2);
          lightNode.lookAt(new Vec3(0, 1.1, 0));
          this.node.addChild(lightNode);
          var light = lightNode.addComponent(DirectionalLight);
          light.color = new Color(255, 244, 222, 255);
          light.illuminance = 72000;
          this.addMesh(this.node, 'Ground', 'plane', new Vec3(0, -0.75, 0), new Vec3(7.4, 1, 7.4), new Color(205, 232, 229, 255), 0.92);
        };
        _proto.createBunny = function createBunny() {
          this.modelRoot = new Node('ProceduralBunny');
          this.modelRoot.setPosition(0, 0.18, 0);
          this.node.addChild(this.modelRoot);
          this.addMesh(this.modelRoot, 'Body', 'sphere', new Vec3(0, 0.25, 0), new Vec3(1.65, 2.05, 1.25), this.cream, 0.88);
          this.addMesh(this.modelRoot, 'Belly', 'sphere', new Vec3(0, 0.23, 0.58), new Vec3(1.02, 1.35, 0.34), this.creamLight, 0.94);
          this.addMesh(this.modelRoot, 'Head', 'sphere', new Vec3(0, 1.72, 0), new Vec3(1.86, 1.68, 1.5), this.cream, 0.86);
          var leftEar = this.addMesh(this.modelRoot, 'LeftEar', 'sphere', new Vec3(-0.58, 3.03, 0), new Vec3(0.57, 1.7, 0.54), this.cream, 0.88);
          leftEar.setRotationFromEuler(0, 0, 8);
          var rightEar = this.addMesh(this.modelRoot, 'RightEar', 'sphere', new Vec3(0.58, 3.03, 0), new Vec3(0.57, 1.7, 0.54), this.cream, 0.88);
          rightEar.setRotationFromEuler(0, 0, -8);
          var leftInner = this.addMesh(this.modelRoot, 'LeftInnerEar', 'sphere', new Vec3(-0.58, 3.05, 0.28), new Vec3(0.3, 1.22, 0.14), this.pink, 0.93);
          leftInner.setRotationFromEuler(0, 0, 8);
          var rightInner = this.addMesh(this.modelRoot, 'RightInnerEar', 'sphere', new Vec3(0.58, 3.05, 0.28), new Vec3(0.3, 1.22, 0.14), this.pink, 0.93);
          rightInner.setRotationFromEuler(0, 0, -8);
          this.addMesh(this.modelRoot, 'LeftEye', 'sphere', new Vec3(-0.42, 1.88, 0.73), new Vec3(0.34, 0.45, 0.2), this.cocoa, 0.3);
          this.addMesh(this.modelRoot, 'RightEye', 'sphere', new Vec3(0.42, 1.88, 0.73), new Vec3(0.34, 0.45, 0.2), this.cocoa, 0.3);
          this.addMesh(this.modelRoot, 'LeftEyeShine', 'sphere', new Vec3(-0.36, 2.0, 0.84), new Vec3(0.09, 0.12, 0.06), Color.WHITE, 0.18);
          this.addMesh(this.modelRoot, 'RightEyeShine', 'sphere', new Vec3(0.48, 2.0, 0.84), new Vec3(0.09, 0.12, 0.06), Color.WHITE, 0.18);
          this.addMesh(this.modelRoot, 'LeftMuzzle', 'sphere', new Vec3(-0.2, 1.52, 0.77), new Vec3(0.46, 0.34, 0.2), this.creamLight, 0.94);
          this.addMesh(this.modelRoot, 'RightMuzzle', 'sphere', new Vec3(0.2, 1.52, 0.77), new Vec3(0.46, 0.34, 0.2), this.creamLight, 0.94);
          this.addMesh(this.modelRoot, 'Nose', 'sphere', new Vec3(0, 1.62, 0.9), new Vec3(0.22, 0.15, 0.12), this.pink, 0.56);
          this.addMesh(this.modelRoot, 'Smile', 'sphere', new Vec3(0, 1.42, 0.87), new Vec3(0.1, 0.08, 0.07), this.cocoa, 0.58);
          this.addMesh(this.modelRoot, 'LeftBlush', 'sphere', new Vec3(-0.66, 1.56, 0.68), new Vec3(0.28, 0.13, 0.08), new Color(244, 163, 166, 210), 0.9, true);
          this.addMesh(this.modelRoot, 'RightBlush', 'sphere', new Vec3(0.66, 1.56, 0.68), new Vec3(0.28, 0.13, 0.08), new Color(244, 163, 166, 210), 0.9, true);
          var leftArm = this.addMesh(this.modelRoot, 'LeftArm', 'sphere', new Vec3(-0.5, 0.38, 0.62), new Vec3(0.48, 1.0, 0.44), this.cream, 0.9);
          leftArm.setRotationFromEuler(0, 0, -16);
          var rightArm = this.addMesh(this.modelRoot, 'RightArm', 'sphere', new Vec3(0.5, 0.38, 0.62), new Vec3(0.48, 1.0, 0.44), this.cream, 0.9);
          rightArm.setRotationFromEuler(0, 0, 16);
          this.addMesh(this.modelRoot, 'LeftFoot', 'sphere', new Vec3(-0.57, -0.63, 0.28), new Vec3(0.82, 0.48, 1.0), this.cream, 0.9);
          this.addMesh(this.modelRoot, 'RightFoot', 'sphere', new Vec3(0.57, -0.63, 0.28), new Vec3(0.82, 0.48, 1.0), this.cream, 0.9);
          var behind = this.addMesh(this.modelRoot, 'BehindSkyBead', 'sphere', new Vec3(-0.62, 1.75, 0.88), new Vec3(0.12, 0.12, 0.07), new Color(101, 177, 231, 125), 0.28, true);
          var first = this.addMesh(this.modelRoot, 'FrontCoralBead', 'sphere', new Vec3(-0.74, 1.67, 0.91), new Vec3(0.19, 0.19, 0.1), this.coral, 0.28);
          var second = this.addMesh(this.modelRoot, 'SecondCoralBead', 'box', new Vec3(0.46, 0.35, 0.98), new Vec3(0.19, 0.19, 0.1), this.coral, 0.32);
          this.addMesh(this.modelRoot, 'GoldBead', 'sphere', new Vec3(0.48, 3.04, 0.31), new Vec3(0.16, 0.16, 0.08), this.gold, 0.32);
          this.stains = [{
            front: first,
            behind: behind,
            position: new Vec3(-0.74, 1.67, 0.91),
            originalScale: first.scale.clone()
          }, {
            front: second,
            position: new Vec3(0.46, 0.35, 0.98),
            originalScale: second.scale.clone()
          }];
        };
        _proto.createOverlay = function createOverlay() {
          this.canvasNode = new Node('OverlayCanvas');
          this.canvasNode.layer = Layers.Enum.UI_2D;
          this.canvasNode.setPosition(195, 422, 0);
          this.node.addChild(this.canvasNode);
          this.canvasNode.addComponent(UITransform).setContentSize(390, 844);
          var canvas = this.canvasNode.addComponent(Canvas);
          var cameraNode = new Node('OverlayCamera');
          cameraNode.layer = Layers.Enum.UI_2D;
          cameraNode.setPosition(0, 0, 1000);
          this.canvasNode.addChild(cameraNode);
          var camera = cameraNode.addComponent(Camera);
          camera.projection = Camera.ProjectionType.ORTHO;
          camera.orthoHeight = 422;
          camera.near = 1;
          camera.far = 2000;
          camera.priority = 10;
          camera.visibility = Layers.Enum.UI_2D;
          camera.clearFlags = Camera.ClearFlag.DEPTH_ONLY;
          canvas.cameraComponent = camera;
          this.addPanel(this.canvasNode, 'HeaderCard', 0, 348, 350, 82, 28, new Color(255, 255, 255, 225));
          this.addLabel(this.canvasNode, '真实 Cocos 3D 程序化样片', 0, 365, 22, new Color(38, 52, 66, 255), 330, true);
          this.addLabel(this.canvasNode, '真实网格 · PBR 材质 · 环境光与主光 · 非图片', 0, 333, 12, new Color(84, 112, 126, 255), 320);
          this.status = this.addLabel(this.canvasNode, '点珊瑚红水桶，3D 水珠会自动寻找同色污渍', 0, -174, 14, new Color(59, 82, 98, 255), 344, true);
          this.addPanel(this.canvasNode, 'Slot', 0, -226, 220, 58, 20, new Color(255, 255, 255, 220));
          this.slotLabel = this.addLabel(this.canvasNode, '洗澡位 0 / 1', 0, -226, 15, new Color(91, 111, 128, 255), 204, true);
          this.bucketNode = this.createBucket(this.canvasNode, 0, -315);
          this.bucketButton = this.bucketNode.addComponent(Button);
          this.bucketNode.on(Button.EventType.CLICK, this.startBathSample, this);
          this.addLabel(this.canvasNode, '程序化基础模型只代表当前可实现下限，不冒充正式建模资产', 0, -390, 11, new Color(94, 115, 126, 255), 350);
        };
        _proto.startBathSample = /*#__PURE__*/function () {
          var _startBathSample = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
            var index, target;
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  if (!this.busy) {
                    _context.next = 2;
                    break;
                  }
                  return _context.abrupt("return");
                case 2:
                  this.busy = true;
                  this.bucketButton.interactable = false;
                  this.slotLabel.string = '洗澡位 1 / 1 · 自动清洗中';
                  this.status.string = '水桶入位，3D 水珠自动寻找珊瑚红污渍…';
                  this.setAutomationStatus('running');
                  Tween.stopAllByTarget(this.bucketNode);
                  tween(this.bucketNode).to(0.32, {
                    position: new Vec3(0, -226, 0),
                    scale: new Vec3(0.9, 0.9, 1)
                  }, {
                    easing: 'quadOut'
                  }).start();
                  _context.next = 11;
                  return this.wait(0.45);
                case 11:
                  index = 0;
                case 12:
                  if (!(index < this.stains.length)) {
                    _context.next = 25;
                    break;
                  }
                  target = this.stains[index];
                  this.bucketCount.string = String(this.stains.length - index);
                  _context.next = 17;
                  return this.flyDroplet(target.position);
                case 17:
                  _context.next = 19;
                  return this.playHit(target);
                case 19:
                  this.bucketCount.string = String(this.stains.length - index - 1);
                  _context.next = 22;
                  return this.wait(0.3);
                case 22:
                  index += 1;
                  _context.next = 12;
                  break;
                case 25:
                  this.status.string = '3D 命中完成：后续天空蓝已露出';
                  this.slotLabel.string = '水桶用完 · 洗澡位已释放';
                  tween(this.bucketNode).to(0.25, {
                    position: new Vec3(0, -252, 0),
                    scale: new Vec3(0.68, 0.68, 1)
                  }).start();
                  tween(this.bucketOpacity).to(0.2, {
                    opacity: 0
                  }).start();
                  this.playCelebration();
                  this.setAutomationStatus('passed');
                  _context.next = 33;
                  return this.wait(2.4);
                case 33:
                  this.resetSample();
                case 34:
                case "end":
                  return _context.stop();
              }
            }, _callee, this);
          }));
          function startBathSample() {
            return _startBathSample.apply(this, arguments);
          }
          return startBathSample;
        }();
        _proto.flyDroplet = function flyDroplet(target) {
          var _this3 = this;
          return new Promise(function (resolve) {
            var droplet = _this3.addMesh(_this3.node, 'CoralWaterDroplet', 'sphere', new Vec3(0, -0.68, 1.3), new Vec3(0.26, 0.34, 0.22), _this3.coral, 0.18);
            var destination = new Vec3(target.x, target.y + _this3.modelRoot.position.y, target.z + 0.18);
            tween(droplet).to(0.66, {
              position: destination,
              scale: new Vec3(0.2, 0.28, 0.18)
            }, {
              easing: 'quadIn'
            }).call(function () {
              droplet.destroy();
              resolve();
            }).start();
          });
        };
        _proto.playHit = function playHit(target) {
          var _this4 = this;
          return new Promise(function (resolve) {
            Tween.stopAllByTarget(_this4.modelRoot);
            tween(_this4.modelRoot).to(0.11, {
              scale: new Vec3(1.035, 0.975, 1),
              eulerAngles: new Vec3(0, -4, -2)
            }).to(0.17, {
              scale: new Vec3(0.985, 1.025, 1),
              eulerAngles: new Vec3(0, 3, 1.5)
            }).to(0.18, {
              scale: Vec3.ONE,
              eulerAngles: Vec3.ZERO
            }).call(function () {
              return _this4.startBreathing();
            }).start();
            tween(target.front).to(0.15, {
              scale: target.originalScale.clone().multiplyScalar(1.22)
            }, {
              easing: 'quadOut'
            }).to(0.26, {
              scale: target.originalScale.clone().multiplyScalar(0.05)
            }, {
              easing: 'quadIn'
            }).call(function () {
              target.front.active = false;
              if (target.behind) {
                target.behind.getComponent(MeshRenderer).setSharedMaterial(_this4.getMaterial(_this4.sky, 0.3), 0);
                tween(target.behind).to(0.28, {
                  scale: new Vec3(0.16, 0.16, 0.09)
                }, {
                  easing: 'backOut'
                }).start();
              }
              resolve();
            }).start();
            _this4.createSplash(target.position);
          });
        };
        _proto.createSplash = function createSplash(target) {
          var _this5 = this;
          var _loop = function _loop() {
            var angle = Math.PI * 2 * index / 8;
            var bead = _this5.addMesh(_this5.node, "Splash" + index, 'sphere', new Vec3(target.x, target.y + _this5.modelRoot.position.y, target.z + 0.15), new Vec3(0.09, 0.09, 0.09), index % 2 === 0 ? _this5.coral : new Color(255, 220, 216, 230), 0.25, index % 2 !== 0);
            tween(bead).by(0.42, {
              position: new Vec3(Math.cos(angle) * 0.42, Math.sin(angle) * 0.38, 0.12),
              scale: new Vec3(-0.07, -0.07, -0.07)
            }, {
              easing: 'quadOut'
            }).call(function () {
              return bead.destroy();
            }).start();
          };
          for (var index = 0; index < 8; index += 1) {
            _loop();
          }
        };
        _proto.playCelebration = function playCelebration() {
          var _this6 = this;
          Tween.stopAllByTarget(this.modelRoot);
          tween(this.modelRoot).to(0.16, {
            scale: new Vec3(1.06, 0.95, 1.02),
            eulerAngles: new Vec3(0, -5, -2)
          }).to(0.22, {
            scale: new Vec3(0.98, 1.05, 1),
            eulerAngles: new Vec3(0, 4, 2)
          }).to(0.24, {
            scale: Vec3.ONE,
            eulerAngles: Vec3.ZERO
          }, {
            easing: 'backOut'
          }).call(function () {
            return _this6.startBreathing();
          }).start();
        };
        _proto.resetSample = function resetSample() {
          var _this7 = this;
          this.stains.forEach(function (target) {
            target.front.active = true;
            target.front.setScale(target.originalScale);
            if (target.behind) {
              target.behind.setScale(0.12, 0.12, 0.07);
              target.behind.getComponent(MeshRenderer).setSharedMaterial(_this7.getMaterial(new Color(101, 177, 231, 125), 0.28, true), 0);
            }
          });
          this.bucketNode.setPosition(0, -315, 0);
          this.bucketNode.setScale(1, 1, 1);
          this.bucketOpacity.opacity = 255;
          this.bucketCount.string = '2';
          this.bucketButton.interactable = true;
          this.slotLabel.string = '洗澡位 0 / 1';
          this.status.string = '点珊瑚红水桶，3D 水珠会自动寻找同色污渍';
          this.busy = false;
          this.startBreathing();
          this.setAutomationStatus('ready');
        };
        _proto.startBreathing = function startBreathing() {
          if (!this.modelRoot || this.busy) return;
          Tween.stopAllByTarget(this.modelRoot);
          tween(this.modelRoot).repeatForever(tween(this.modelRoot).to(1.5, {
            scale: new Vec3(1.012, 0.99, 1.01)
          }, {
            easing: 'sineInOut'
          }).to(1.5, {
            scale: Vec3.ONE
          }, {
            easing: 'sineInOut'
          })).start();
        };
        _proto.addMesh = function addMesh(parent, name, shape, position, scale, color, roughness, transparent) {
          if (transparent === void 0) {
            transparent = false;
          }
          var node = new Node(name);
          node.setPosition(position);
          node.setScale(scale);
          parent.addChild(node);
          var renderer = node.addComponent(MeshRenderer);
          renderer.setSharedMaterial(this.getMaterial(color, roughness, transparent), 0);
          renderer.mesh = this.getMesh(shape);
          return node;
        };
        _proto.getMesh = function getMesh(shape) {
          var cached = this.meshes.get(shape);
          if (cached) return cached;
          var geometry = shape === 'sphere' ? primitives.sphere(0.5, {
            segments: 24
          }) : shape === 'box' ? primitives.box({
            width: 1,
            height: 1,
            length: 1
          }) : primitives.plane({
            width: 1,
            length: 1,
            widthSegments: 1,
            lengthSegments: 1
          });
          var mesh = utils.createMesh(geometry);
          this.meshes.set(shape, mesh);
          return mesh;
        };
        _proto.getMaterial = function getMaterial(color, roughness, transparent) {
          if (transparent === void 0) {
            transparent = false;
          }
          var key = color.r + "-" + color.g + "-" + color.b + "-" + color.a + "-" + roughness + "-" + transparent;
          var cached = this.materials.get(key);
          if (cached) return cached;
          var material = new Material();
          material.copy(this.standardMaterial, {
            technique: transparent ? 1 : 0
          });
          if (!material.passes || material.passes.length === 0) {
            throw new Error("T1-3D project material has no render passes (technique=" + (transparent ? 1 : 0) + ")");
          }
          material.setProperty('mainColor', color);
          material.setProperty('roughness', roughness);
          material.setProperty('metallic', 0);
          material.setProperty('specularIntensity', transparent ? 0.7 : 0.35);
          this.materials.set(key, material);
          return material;
        };
        _proto.createBucket = function createBucket(parent, x, y) {
          var node = new Node('CoralBucket');
          node.layer = Layers.Enum.UI_2D;
          node.setPosition(x, y, 0);
          parent.addChild(node);
          node.addComponent(UITransform).setContentSize(118, 76);
          this.bucketOpacity = node.addComponent(UIOpacity);
          var graphics = node.addComponent(Graphics);
          graphics.lineWidth = 7;
          graphics.strokeColor = this.coralDeep;
          graphics.arc(0, 12, 33, Math.PI, 0, false);
          graphics.stroke();
          graphics.fillColor = this.coral;
          graphics.roundRect(-49, -31, 98, 58, 18);
          graphics.fill();
          graphics.strokeColor = this.coralDeep;
          graphics.lineWidth = 3;
          graphics.roundRect(-49, -31, 98, 58, 18);
          graphics.stroke();
          this.addLabel(node, '珊瑚红', -10, -2, 14, Color.WHITE, 72, true);
          var countPanel = this.addPanel(node, 'Count', 35, -2, 30, 30, 15, Color.WHITE);
          this.bucketCount = this.addLabel(countPanel, '2', 0, 0, 15, this.coralDeep, 28, true);
          return node;
        };
        _proto.addPanel = function addPanel(parent, name, x, y, width, height, radius, color) {
          var node = new Node(name);
          node.layer = Layers.Enum.UI_2D;
          node.setPosition(x, y, 0);
          parent.addChild(node);
          node.addComponent(UITransform).setContentSize(width, height);
          var graphics = node.addComponent(Graphics);
          graphics.fillColor = color;
          graphics.roundRect(-width / 2, -height / 2, width, height, radius);
          graphics.fill();
          return node;
        };
        _proto.addLabel = function addLabel(parent, text, x, y, fontSize, color, width, bold) {
          if (bold === void 0) {
            bold = false;
          }
          var node = new Node("Label:" + text);
          node.layer = Layers.Enum.UI_2D;
          node.setPosition(x, y, 0);
          parent.addChild(node);
          node.addComponent(UITransform).setContentSize(width, fontSize * 1.9);
          var label = node.addComponent(Label);
          label.string = text;
          label.fontSize = fontSize;
          label.lineHeight = Math.round(fontSize * 1.3);
          label.color = color;
          label.isBold = bold;
          label.horizontalAlign = HorizontalTextAlignment.CENTER;
          label.verticalAlign = VerticalTextAlignment.CENTER;
          label.overflow = Label.Overflow.SHRINK;
          return label;
        };
        _proto.wait = function wait(seconds) {
          var _this8 = this;
          return new Promise(function (resolve) {
            return _this8.scheduleOnce(resolve, seconds);
          });
        };
        _proto.setAutomationStatus = function setAutomationStatus(status) {
          if (typeof document !== 'undefined') {
            document.documentElement.dataset.t1Status = status;
            document.documentElement.dataset.renderMode = 'actual-3d';
          }
        };
        return T1ThreeDProof;
      }(Component)) || _class));
      cclegacy._RF.pop();
    }
  };
});

(function(r) {
  r('virtual:///prerequisite-imports/main', 'chunks:///_virtual/main'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});