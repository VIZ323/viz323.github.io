SwiftLint代码规范属性说明(二)
====================

规则系列文章为转载，网页格式存在一些问题，在此仅作为记录使用
一： https://www.jianshu.com/p/328091791033
二： https://www.jianshu.com/p/146bd915c8a1
三： https://www.jianshu.com/p/58fe2e9247e8



> 
> *   [Github 公布的 Swift 代码规范--原文](https://link.jianshu.com?t=https%3A%2F%2Fgithub.com%2Fgithub%2Fswift-style-guide)
> *   [Github 公布的 Swift 代码规范--中文](https://link.jianshu.com?t=https%3A%2F%2Fgithub.com%2FArtwalk%2Fswift-style-guide%2Fblob%2Fmaster%2FREADME_CN.md)
> *   [官方的SwiftLint规则说明](https://link.jianshu.com?t=https%3A%2F%2Fgithub.com%2Frealm%2FSwiftLint%2Fblob%2Fmaster%2FRules.md)

以下个属性均按照字母顺序排列
--------------

### 规则51: legacy\_cggeometry\_functions

当获取某个视图的宽、高、最小X、最大X值等等， swiftlint推荐使用swift的标准语法， 尽量不要使用从Objective-C中的遗留版本， 尽量语法swift化

识别码

默认是否启用

是否支持自动更正

类型

legacy\_cggeometry\_functions

启用

yes

idiomatic

代码示例:

    /// 这样不推荐使用
    CGRectGetWidth(someView.frame)
    
    /// 推荐使用下面的形式
    rect.width
    rect.height
    rect.minX
    rect.midX
    rect...................
    
    

### 规则52: legacy\_constant

和属性`legacy_cggeometry_functions`一样， 结构范围常数尽量分开、明确、具体， 不要使用OC的遗留整体常数

识别码

默认是否启用

是否支持自动更正

类型

legacy\_constant

启用

yes

idiomatic

代码示例:

    /// 规范的写法，不会触发warning
    CGPoint.zero
    
    /// 不规范的写法， 会触发warning
    CGPointZero
    CGRectZero
    

### 规则53: legacy\_constructor

swiftlint要求系统自带构造器， 使用swift语法化， 不要使用OC版本的构造器

识别码

默认是否启用

是否支持自动更正

类型

legacy\_constructor

启用

yes

idiomatic

代码示例:

    /// swift语法，相信之后系统也会强制规定使用
    CGPoint（x: 10， y: 20）
    
    /// 错误的构造器语法
    CGPointMake(10, 20)
    

### 规则54: legacy\_nsgeometry\_functions

ns类几何函数， 和前面的几个属性一样， 使用swift点语法函数， 不使用以前的版本。

识别码

默认是否启用

是否支持自动更正

类型

legacy\_nsgeometry\_functions

启用

yes

idiomatic

代码示例:

    /// 正确
    view.width/height/minX
    
    /// 错误
    NSWidth(view.frame)
    

### 规则55: let\_var\_whitespace

let和var语句应该用空白行与其他语句分开

识别码

默认是否启用

是否支持自动更正

类型

let\_var\_whitespace

未启用

no

style

代码示例:

    //推荐这样写
    let a = 0
    var x = 1
    
    x = 2
    
    
    //不建议写法
    var x = 1
    x = 2
    

### 规则56: line\_length

行的字符长度属性。这个强烈不推荐使用。官方的规定是超过120字符就给warning， 超过200个字符就直接报error！！！我们又不是写底层脚本的，所以建议这种方式禁用！！

识别码

默认是否启用

是否支持自动更正

类型

line\_length

启用

no

metrics

### 规则57: literal\_expression\_end\_indentation

字典和数组的开头和结尾要有相同的缩进格式

识别码

默认是否启用

是否支持自动更正

类型

literal\_expression\_end\_indentation

未启用

no

style

### 规则58: mark

标记方法或者属性。这个推荐使用， 可以统一方法标记的格式， 有利于review查找某个方法或者属性的时候更清晰。使用也非常简单： “MARK”前空一格，”MARK:”后空一格。

识别码

默认是否启用

是否支持自动更正

类型

mark

启用

yes

lint

代码示例:

    //推荐写法
    // MARK: good
    // MARK: - good
    // MARK: -
    
    //不建议写法
    //MARK: bad
    // MARK:bad
    //MARK:bad
    //  MARK: bad
    // MARK:  bad
    // MARK: -bad
    

### 规则59: multiline\_arguments

调用函数和方法时, 其参数应该在同一行上，或者每行一个

识别码

默认是否启用

是否支持自动更正

类型

multiline\_arguments

未启用

no

style

代码示例:

    //不建议以下写法
    foo(0, param1: 1, param2: true,
        param3: [3])
        
    foo(
        0, param1: 1,
        param2: true, param3: [3]
    )
    

### 规则60: multiline\_parameters

声明函数和方法时, 其参数应该在同一行上，或者每行一个

识别码

默认是否启用

是否支持自动更正

类型

multiline\_parameters

未启用

no

style

代码示例:

    //不建议以下写法
    protocol Foo {
       func foo(param1: Int,
                 param2: Bool, param3: [String]) { }
    }
    
    protocol Foo {
       func foo(param1: Int, param2: Bool,
                 param3: [String]) { }
    }
    

### 规则61: multiple\_closures\_with\_trailing\_closure

当函数有多个闭包时, 不建议使用尾随闭包语法

识别码

默认是否启用

是否支持自动更正

类型

multiple\_closures\_with\_trailing\_closure

启用

no

style

代码示例:

    //不建议写法
    foo.something(param1: { $0 }) { $0 + 1 }
    
    UIView.animate(withDuration: 1.0, animations: {
        someView.alpha = 0.0
    }) { _ in
        someView.removeFromSuperview()
    }
    

### 规则62: nesting

嵌套。类型嵌套至多一级结构， 函数语句嵌套至多五级结构。

识别码

默认是否启用

是否支持自动更正

类型

nesting

启用

no

metrics

### 规则63: nimble\_operator

快捷操作符。和自由匹配函数相比， 更喜欢快捷操作符， 比如：>=、 ==、 <=、 <等等。

识别码

默认是否启用

是否支持自动更正

类型

nimble\_operator

未启用

yes

idiomatic

代码示例:

    /// 会触发warning
    (person.voice).toNot(equal("Hello world"))     // 判断字符串相同
    10.to(beGreaterThan(5))     // 10比5大
    99.to(beLessThan(100))       // 99比100小
    
    // 改为以下
    (person.voice) != "Hello world"   // 判断字符串相同
    10 > 5                // 10比5大
    99 < 100              // 99比100小
    

### 规则64: no\_extension\_access\_modifier

在extension扩展前面,不建议使用(fileprivate, public)等修饰符

识别码

默认是否启用

是否支持自动更正

类型

no\_extension\_access\_modifier

未启用

no

idiomatic

代码示例:

    //不推荐写法
    private extension String {}
    public extension String {}
    open extension String {}
    internal extension String {}
    fileprivate extension String {}
    

### 规则65: no\_grouping\_extension

只有class和protocol可以使用extension,其他类型不可使用

识别码

默认是否启用

是否支持自动更正

类型

no\_grouping\_extension

未启用

no

idiomatic

代码示例:

    //不推荐写法
    enum Fruit {}
    extension Fruit {}
    
    extension Tea: Error {}
    struct Tea {}
    
    class Ham { class Spam {}}
    extension Ham.Spam {}
    
    extension External { struct Gotcha {}}
    extension External.Gotcha {}
    

### 规则66: notification\_center\_detachment

对象移除通知只能在deinit移除self,函数中不能removeObserver(self)

识别码

默认是否启用

是否支持自动更正

类型

notification\_center\_detachment

启用

no

lint

代码示例:

    //不会触发warning
    class Foo { 
       deinit {
           NotificationCenter.default.removeObserver(self)
       }
    }
    
    class Foo { 
       func bar() {
           NotificationCenter.default.removeObserver(otherObject)
       }
    }
    
    
    //会触发warning
    class Foo { 
       func bar() {
           NotificationCenter.default.removeObserver(self)
       }
    }
    

### 规则67: number\_separator

数字分割线。当在大量的小数中， 应该使用下划线来作为千分位分割线

识别码

默认是否启用

是否支持自动更正

类型

number\_separator

未启用

yes

style

代码示例:

    /// 推荐使用这种形式
    let xxx = 1_000_000_000.000_1
    print(xxx)
    
    /// 不推荐使用这种形式（在swift 
    let xxx = 1000000000.0001
    print(xxx)
    

### 规则68: object\_literal

swiftlint表示比起图片和颜色初始化，更喜欢对象初始化。因为swift初始化可以用表情，图片，颜色等，这不符合项目中的一些习惯用法

识别码

默认是否启用

是否支持自动更正

类型

object\_literal

未启用

no

idiomatic

代码示例:

    //不会触发warning
    let image = #imageLiteral(resourceName: "image.jpg")
    let color = #colorLiteral(red: 0.9607843161, green: 0.7058823705, blue: 0.200000003, alpha: 1)
    let image = UIImage(named: aVariable)
    let image = UIImage(named: "interpolated \(variable)")
    let color = UIColor(red: value, green: value, blue: value, alpha: 1)
    let image = NSImage(named: aVariable)
    let image = NSImage(named: "interpolated \(variable)")
    let color = NSColor(red: value, green: value, blue: value, alpha: 1)
    
    //会触发warning
    let image = ↓UIImage(named: "foo")
    let color = ↓UIColor(red: 0.3, green: 0.3, blue: 0.3, alpha: 1)
    let color = ↓UIColor(red: 100 / 255.0, green: 50 / 255.0, blue: 0, alpha: 1)
    let color = ↓UIColor(white: 0.5, alpha: 1)
    

### 规则69: opening\_brace

花括号之前应该有一个空格,且与声明在同一行

识别码

默认是否启用

是否支持自动更正

类型

opening\_brace

启用

yes

style

代码示例:

    //建议写法
    func abc() {
    }
    [].map() { $0 }
    [].map({ })
    if let a = b { }
    while a == b { }
    guard let a = b else { }
    

### 规则70: operator\_usage\_whitespace

操作符使用规则， 操作符两边应该有空格。比如 “+” “-” “？？”

识别码

默认是否启用

是否支持自动更正

类型

operator\_usage\_whitespace

未启用

yes

style

代码示例:

    //建议写法
    let foo = 1 + 2
    let foo = 1 > 2
    let foo = !false
    
    //不推荐写法
    let foo = 1+2
    let foo = 1   + 2
    let foo = 1   +    2
    let foo = 1 +    2
    let foo=1+2
    

### 规则71: operator\_whitespace

空格/空白操作符。当定义空格操作符的时候，被定义的名字或类型两边应该各有一个单行空格操作符

识别码

默认是否启用

是否支持自动更正

类型

operator\_whitespace

启用

no

style

代码示例:

    // 触发警告
    class Something: Equatable {
        var text: String?
    
        // "=="和“(lhs: Something, rhs: Something)”之间应该有一个空格
        static func ==(lhs: Something, rhs: Something) -> Bool {
            return lhs.text == rhs.text
        }
    
    }
    

### 规则72: overridden\_super\_call

一些重写的方法应该调用super.(父类的)方法

识别码

默认是否启用

是否支持自动更正

类型

overridden\_super\_call

未启用

no

lint

代码示例:

    /// 这样会触发警告
     class VCd: UIViewController {
         override func viewWillAppear(_ animated: Bool) {
            //没有调用父类
    
         }
     }
    
     /// 不会触发警告
      class VCd: UIViewController {
         override func viewWillAppear(_ animated: Bool) {
            super.viewWillAppear(animated)
    
         }
      }
    
    

### 规则73: override\_in\_extension

在extension中,不能重写未声明的属性和未定义的方法

识别码

默认是否启用

是否支持自动更正

类型

override\_in\_extension

未启用

no

lint

代码示例:

    //错误写法
    extension Person {
      //该属性之前未定义, 不能重写
      override var age: Int { return 42 }
    }
    
    extension Person {
      //该方法之前也为定义不能重写
      override func celebrateBirthday() {}
    }
    

### 规则74: pattern\_matching\_keywords

识别码

默认是否启用

是否支持自动更正

类型

pattern\_matching\_keywords

未启用

no

idiomatic

...  
在switch-case语句中, 建议不要将case中的let和var等关键字放到元祖内

识别码

默认是否启用

是否支持自动更正

类型

pattern\_matching\_keywords

未启用

no

idiomatic

代码示例:

### 规则75: aaa

...

识别码

默认是否启用

是否支持自动更正

类型

aaa

未启用

no

style

代码示例:

    //正确写法
    switch foo {
        case let .foo(x, y): break
    }
    switch foo {
        case .foo(let x), .bar(let x): break
    }
    
    //错误写法
    switch foo {
        case (↓let x,  ↓let y): break
    }
    switch foo {
        case .foo(↓let x, ↓let y): break
    }
    switch foo {
        case (.yamlParsing(↓let x), .yamlParsing(↓let y)): break
    }
    switch foo {
        case (↓var x,  ↓var y): break
    }
    switch foo {
        case .foo(↓var x, ↓var y): break
    }
    

### 规则76: prefixed\_toplevel\_constant

类似全局常量,建议前缀以k开头

识别码

默认是否启用

是否支持自动更正

类型

prefixed\_toplevel\_constant

未启用

no

style

代码示例:

    //推荐写法
    private let kFoo = 20.0
    public let kFoo = false
    internal let kFoo = "Foo"
    let kFoo = true
    

### 规则77: private\_action

IBActions修饰的方法,应该都是私有的

识别码

默认是否启用

是否支持自动更正

类型

private\_action

未启用

no

lint

代码示例:

    //推荐写法
    class Foo {
        @IBAction private func barButtonTapped(_ sender: UIButton) {}
    }
    struct Foo {
        @IBAction private func barButtonTapped(_ sender: UIButton) {}
    }
    class Foo {
        @IBAction fileprivate func barButtonTapped(_ sender: UIButton) {}
    }
    struct Foo {
        @IBAction fileprivate func barButtonTapped(_ sender: UIButton) {}
    }
    private extension Foo {
        @IBAction func barButtonTapped(_ sender: UIButton) {}
    }
    fileprivate extension Foo {
        @IBAction func barButtonTapped(_ sender: UIButton) {}
    }
    

### 规则78: private\_outlet

IBOutlets修饰的属性应该都是私有的

识别码

默认是否启用

是否支持自动更正

类型

private\_outlet

未启用

no

lint

代码示例:

    //推荐写法
    class Foo {
      @IBOutlet private var label: UILabel?
    }
    class Foo {
      @IBOutlet private var label: UILabel!
    }
    
    //不推荐写法
    class Foo {
      @IBOutlet var label: UILabel?
    }
    class Foo {
      @IBOutlet var label: UILabel!
    }
    

### 规则79: private\_over\_fileprivate

private比fileprivate的私有程度更高

识别码

默认是否启用

是否支持自动更正

类型

private\_over\_fileprivate

启用

yes

idiomatic

### 规则80: private\_unit\_test

私有的单元测试。被标记为private的单元测试不会被测试工具XCTest运行， 也就是说，被标记为private的单元测试会被静态跳过

识别码

默认是否启用

是否支持自动更正

类型

private\_unit\_test

启用

no

lint

代码示例:

    private ↓class FooTest: XCTestCase { ...............继承于测试用例类XCTestCase, 被标记为private，所以触发warning
         func test1() {}
         internal func test2() {}
         public func test3() {}
         private func test4() {}.......另外注意这里，上面既然不会通过，那显然这里也不会通过，根本不会走这个func
     }  
    
     internal class FooTest: XCTestCase { ......开始通过测试，因为没有被标记为private
         func test1() {}
         internal func test2() {}
         public func test3() {}
         private ↓func test4() {}................不通过，因为被标记为private
     }
    
     public class FooTest: XCTestCase { ..........通过
         func test1() {}
         internal func test2() {}
         public func test3() {}
         private ↓func test4() {}.................不通过，因为被标记成private
     }
    
     class FooTest: XCTestCase { ..........通过
         func test1() {}
         internal func test2() {}
         public func test3() {}
         private ↓func test4() {}.................不通过，因为被标记成private
     }
    

### 规则81: prohibited\_super\_call

一些方法不应该调用父类的方法

识别码

默认是否启用

是否支持自动更正

类型

prohibited\_super\_call

未启用

no

lint

代码示例:

    //以下方法不建议调用父类的方法
    class VC: UIViewController {
        override func loadView() {↓
            super.loadView()
        }
    }
    class VC: NSFileProviderExtension {
        override func providePlaceholder(at url: URL,completionHandler: @escaping (Error?) -> Void) {↓
            self.method1()
            super.providePlaceholder(at:url, completionHandler: completionHandler)
        }
    }
    class VC: NSView {
        override func updateLayer() {↓
            self.method1()
            super.updateLayer()
            self.method2()
        }
    }
    class VC: NSView {
        override func updateLayer() {↓
            defer {
                super.updateLayer()
            }
        }
    }
    

### 规则82: protocol\_property\_accessors\_order

在协议中声明属性时，访问者的顺序应该是get set

识别码

默认是否启用

是否支持自动更正

类型

protocol\_property\_accessors\_order

启用

yes

style

代码示例:

    //建议
    protocol Foo {
       var bar: String { get set }
    }
     
     //不建议
    protocol Foo {
       var bar: String { set get }
    }
    

### 规则83: quick\_discouraged\_call

在单元测试中,不建议在describe和content比保重直接调用方法和类

识别码

默认是否启用

是否支持自动更正

类型

quick\_discouraged\_call

未启用

no

lint

### 规则84: quick\_discouraged\_focused\_test

在单元测试中,不建议集中测试,否则可能不能运行成功

识别码

默认是否启用

是否支持自动更正

类型

quick\_discouraged\_focused\_test

未启用

no

lint

代码示例:

    //官方示例, 不建议
    class TotoTests: QuickSpec {
       override func spec() {
           ↓fdescribe("foo") { }
       }
    }
    

### 规则85: quick\_discouraged\_pending\_test

单元测试中阻止未进行的测试单元

识别码

默认是否启用

是否支持自动更正

类型

quick\_discouraged\_pending\_test

未启用

no

lint

### 规则86: redundant\_discardable\_let

不需要初始化方法返回结果时,建议使用: \_ = Person(), 而不是:let \_ = Person()

识别码

默认是否启用

是否支持自动更正

类型

redundant\_discardable\_let

启用

yes

style

代码示例:

    //推荐
    _ = foo()
    if let _ = foo() { }
    guard let _ = foo() else { return }
    
    //不建议
    let _ = foo()
    if _ = foo() { let _ = bar() }
    

### 规则87: redundant\_nil\_coalescing

使用可能为为nil的可选值时,建议使用: str ?? "", ??左右两侧要有一个空格

识别码

默认是否启用

是否支持自动更正

类型

redundant\_nil\_coalescing

未启用

yes

idiomatic

代码示例:

    //建议写法
    var myVar: Int?; myVar ?? 0
    
    //不建议写法
    var myVar: Int? = nil; myVar  ?? nil
    var myVar: Int? = nil; myVar??nil
    

### 规则88: redundant\_optional\_initialization

初始化nil变量是,不建议赋值nil

识别码

默认是否启用

是否支持自动更正

类型

redundant\_optional\_initialization

启用

yes

idiomatic

代码示例:

    //不会触发warning
    var myVar: Int?
    let myVar: Int? = nil
    var myVar: Optional<Int>
    let myVar: Optional<Int> = nil
    
    //会触发warning
    var myVar: Int?↓ = nil
    var myVar: Optional<Int>↓ = nil
    var myVar: Int?↓=nil
    var myVar: Optional<Int>↓=nil
    

### 规则89: redundant\_string\_enum\_value

在定义字符串枚举的时候, 当字符串枚举值等于枚举名称时，可以不用赋值

识别码

默认是否启用

是否支持自动更正

类型

redundant\_string\_enum\_value

启用

no

idiomatic

代码示例:

    //不会触发warning
    enum Numbers: String {
     case one
     case two
    }
    enum Numbers: Int {
     case one = 1
     case two = 2
    }
    
    //会触发warning
    enum Numbers: String {
     case one = ↓"one"
     case two = ↓"two"
    }
    enum Numbers: String {
     case one = ↓"one", two = ↓"two"
    }
    

### 规则90: redundant\_void\_return

当函数返回值为Void时,建议不谢返回值, 定义常量或者变量的时候可以

识别码

默认是否启用

是否支持自动更正

类型

redundant\_void\_return

启用

yes

idiomatic

代码示例:

    //不会触发warning
    func foo() {}
    func foo() -> Int {}
    func foo() -> Int -> Void {}
    func foo() -> VoidResponse
    let foo: Int -> Void
    
    //会触发warning
    func foo()↓ -> Void {}
    protocol Foo {
     func foo()↓ -> Void
    }
    func foo()↓ -> () {}
    protocol Foo {
     func foo()↓ -> ()
    }
    
    

### 规则91: required\_enum\_case

定义的枚举,必须有与其对应的操作实现

识别码

默认是否启用

是否支持自动更正

类型

required\_enum\_case

未启用

no

lint

### 规则92: return\_arrow\_whitespace

swiftlint推荐返回箭头和返回类型应该被空格分开

识别码

默认是否启用

是否支持自动更正

类型

return\_arrow\_whitespace

启用

yes

style

代码示例:

    //推荐写法
    func abc() -> Int {}
    func abc() -> [Int] {}
    
    //不建议写法
    func abc()↓->Int {}
    func abc()↓->[Int] {}
    func abc()↓->(Int, Int) {}
    func abc()↓-> Int {}
    func abc()↓ ->Int {}
    

### 规则93: shorthand\_operator

在swiftlint中， 就是我们常用的简洁操作运算符，比如：+= ， -=， \*=， /= 等等。在swiftlint中，在做一些赋值操作的时候，推荐使用简短操作符

识别码

默认是否启用

是否支持自动更正

类型

shorthand\_operator

启用

no

style

代码示例:

        /// 不推荐使用
        var value = 4
        value = value / 2
        print(value)
    
        /// 推荐使用
        var value = 4
        value /= 2
        print(value)
    

### 规则94: single\_test\_class

单元测试中,测试文件应该包含一个QuickSpec或XCTestCase类

识别码

默认是否启用

是否支持自动更正

类型

single\_test\_class

未启用

no

style

### 规则95: sorted\_first\_last

在获取某数组中最大最小值时,建议使用min和max函数,而不是sorted().first和sorted().lase

识别码

默认是否启用

是否支持自动更正

类型

sorted\_first\_last

未启用

no

style

代码示例:

### 规则96: aaa

...

识别码

默认是否启用

是否支持自动更正

类型

aaa

未启用

no

style

代码示例:

    //建议
    let min = myList.min()
    let min = myList.min(by: { $0 < $1 })
    let min = myList.min(by: >)
    let min = myList.max()
    let min = myList.max(by: { $0 < $1 })
    
    //不建议
    myList.sorted().first
    myList.sorted(by: { $0.description < $1.description }).first
    myList.sorted(by: >).first
    myList.map { $0 + 1 }.sorted().first
    myList.sorted(by: someFunction).first
    

### 规则97: sorted\_imports

分类/有序导入。 这个属性有些奇怪， 要求导入的时候导入的类要按顺序导入

识别码

默认是否启用

是否支持自动更正

类型

sorted\_imports

未启用

yes

style

代码示例:

    //建议写法
    import AAA
    import BBB
    import CCC
    import DDD
    
    
    import Alamofire
    import API
    

### 规则98: statement\_position

陈述句位置， 这里主要指的是 else 和 catch 前面要加一个空格， 也不能大于1个空格， 否则就会触发警告

识别码

默认是否启用

是否支持自动更正

类型

statement\_position

启用

yes

style

代码示例:

        /// 没有空格，触发warning
        let number = "long"
        if number.isEmpty {
            print("为空")
        }else {.............................注意这里
            print("不为空")
        }
    
        /// 这里也会触发warning， 因为else if换行了
        let number = "long"
        if number.isEmpty {
            print("为空")
        }
        else if number.contains("long") {............................注意这里
            print("不为空")
        } else {
            print("s")
        }
    
        /// 正确的写法
        let number = "long"
        if number.isEmpty {
            print("为空")
        } else {
            print("不为空")
        }
    

### 规则99: strict\_fileprivate

extension中不建议使用fileprivate 修饰方法和属性

识别码

默认是否启用

是否支持自动更正

类型

strict\_fileprivate

未启用

no

idiomatic

### 规则100: superfluous\_disable\_command

被禁用的规则不会在禁用区域触发警告

识别码

默认是否启用

是否支持自动更正

类型

superfluous\_disable\_command

启用

no

lint

> 文中如有不足之处请多指教

> 持续更新中.....