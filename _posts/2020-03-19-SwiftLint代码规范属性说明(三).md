---
layout: post  
title:  "SwiftLint代码规范属性说明(三)"  
date: 2020-03-19  
description: "SwiftLint"
tag: SwiftLint
---
SwiftLint代码规范属性说明(三)
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
### 规则101: switch\_case\_alignment

switch-case语句中switch和case应该垂直对齐

识别码

默认是否启用

是否支持自动更正

类型

switch\_case\_alignment

启用

no

style

代码示例:

    //应该是这样
    switch someBool {
    case true: // case 1
        print('red')
    case false:
        if case let .someEnum(val) = someFunc() {
            print('blue')
        }
    }
    
    //而不是这样
    switch someBool {
        ↓case true:
             print('red')
        ↓case false:
             print('blue')
    }
    

### 规则102: switch\_case\_on\_newline

在switch语法里， case应该总是在一个新行上面

识别码

默认是否启用

是否支持自动更正

类型

switch\_case\_on\_newline

启用

no

idiomatic

代码示例:

    /// swiftlint表示会触发warning
        switch type {
        case .value1: print("1")...................在同一行错
        case .value2: print("2")...................在同一行错
        default: print("3")...................在同一行错
        }
    
        /// 不会触发warning
        switch type {
        case .value1:
            print("1")
        case .value2:
            print("2")
        default:
            print("3")
        }
    
    

### 规则103: syntactic\_sugar

swiftlint推荐使用速记语法糖， 例如 \[Int\] 代替 Array, 强烈建议推荐使用

识别码

默认是否启用

是否支持自动更正

类型

syntactic\_sugar

启用

no

idiomatic

代码示例:

    /// 触发warning
        let myArray: Array<Int> = [1, 2, 3]
        print(myArray)
    
        /// 正确写法，不会触发warning
        let myArray: [Int] = [1, 2, 3]
        print(myArray)
    
    

### 规则104: todo

TODO 和 FIXME 应该避免使用， 使用“notaTODO 和 notaFIXME”代替。另外， 和 MARK 标记不同的是， “notaTODO 和 notaFIXME”没有空格要求

识别码

默认是否启用

是否支持自动更正

类型

todo

启用

no

lint

### 规则105: trailing\_closure

关于闭包中{}的使用, 推荐使用尾随闭包的语法

识别码

默认是否启用

是否支持自动更正

类型

trailing\_closure

未启用

no

style

代码示例:

    //推荐使用
    foo.map { $0 + 1 }
    foo.reduce(0) { $0 + 1 }
    
    //不推荐使用
    foo.map({ $0 + 1 })
    ↓foo.reduce(0, combine: { $0 + 1 })
    

### 规则106: trailing\_comma

识别码

默认是否启用

是否支持自动更正

类型

trailing\_comma

启用

yes

style

...  
这个属性主要针对数组和字典最后一个元素, 不建议在最后一个元素会面加逗号

识别码

默认是否启用

是否支持自动更正

类型

trailing\_comma

启用

yes

style

代码示例:

    /// 数组这样写是没有任何问题的, 但是最后一个元素3后面加了一个逗号“,”尽管这样不会报错，但是这会让程序的可读性变差
    let ages = [1, 2, 3,]
    let person = ["XingYun": 98, "JinGang": 128, "LangKe": 18,]
    
    /// 使用swiftlint的trailing_comma规则后，就会报warning， 所以正确的写法不应该加上这个“,”
    let ages = [1, 2, 3]
    let person = ["XingYun": 98, "JinGang": 128, "LangKe": 18]
    
    

### 规则107: trailing\_newline

文件（属性、方法）结束的的时候（“}”之前）， 应该有一个空格新行，但这里要注意的是

识别码

默认是否启用

是否支持自动更正

类型

trailing\_newline

启用

yes

style

代码示例:

    /// 空一行，不会触发警告
    nonTriggeringExamples: [
        "let a = 0\n"
    ],
    
    /// 下面会触发警告
    triggeringExamples: [
        "let a = 0",   /// 不空行，会触发警告（实际上，我试过，不会触发警告）
        "let a = 0\n\n"   /// 空两行， 会触发警告（实际上，我试过，会触发警告，但是触发的是vertical_whitespace警告而不是trailing_newline）
    ],
    
    /// 说说这里，它要求改正为都空一行，虽然这样code看起来很轻松，但如果定义变量或常量太多，就太分散了（值得说的是，就算不空行也不会触发trailing_newline, 应该刚才也已经说了，这个属性只是说“应该”，而不是必须）
    corrections: [
        "let a = 0": "let a = 0\n",
        "let b = 0\n\n": "let b = 0\n",
        "let c = 0\n\n\n\n": "let c = 0\n"
    ]
    
    

### 规则108: trailing\_semicolon

尽管在变量或常量赋值之后加不加分号在swift中没有硬性的要求，但是为了使code style更swift化，所以尽量或者绝对不要加“;”

识别码

默认是否启用

是否支持自动更正

类型

trailing\_semicolon

启用

yes

idiomatic

### 规则109: trailing\_whitespace

函数方法结束后,不建议添加空格行, 和vertical\_whitespace貌似有冲突

识别码

默认是否启用

是否支持自动更正

类型

trailing\_whitespace

启用

yes

style

代码示例:

    /// 下面这个例子不会触发警告，但是一旦其中有一个空行就会触发警告trailing_whitespace, 这和vertical_whitespace实质上有些冲突，vertical_whitespace要求两行code之间不超过1行，要么没有空行，要么只有1行，而trailing_whitespace要求没有空行！！！
    class ViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        let a = 0
        let b = 1
        let c = 2
    }
    func chenlong() -> Void {
        let a = 0
        print(a)
    }
    }
    
    

### 规则110: type\_body\_length

类型体长度。类型体长度不应该跨越太多行， 超过200行给warning，超过350行给error。一般是大括号或者括号内, 比如定义一个enum或struct

识别码

默认是否启用

是否支持自动更正

类型

type\_body\_length

启用

no

metrics

### 规则111: type\_name

识别码

默认是否启用

是否支持自动更正

类型

type\_name

启用

no

idiomatic

...  
类型名， 类型名应该只包含字母数字字符， 并且以大写字母开头，长度在3-40个字符

识别码

默认是否启用

是否支持自动更正

类型

type\_name

启用

no

idiomatic

### 规则112: unneeded\_break\_in\_switch

在switch-case语句中, 有方法调用或操作时,避免使用break语句

识别码

默认是否启用

是否支持自动更正

类型

unneeded\_break\_in\_switch

启用

no

idiomatic

代码示例:

    //不会触发warning
    switch foo {
    case .bar:
        break
    }
    switch foo {
    default:
        break
    }
    switch foo {
    case .bar:
        something()
    }
    
    //会触发warning
    switch foo {
    case .bar:
    //这里已经有方法调用了
        something()
        ↓break
    }
    

### 规则113: unneeded\_parentheses\_in\_closure\_argument

识别码

默认是否启用

是否支持自动更正

类型

unneeded\_parentheses\_in\_closure\_argument

未启用

yes

style

...  
在定义或使用闭包时,闭包参数不建议使用括号()

识别码

默认是否启用

是否支持自动更正

类型

unneeded\_parentheses\_in\_closure\_argument

未启用

yes

style

代码示例:

    //建议
    let foo = { (bar: Int) in }
    let foo = { bar, _  in }
    let foo = { bar in }
    
    //不建议
    call(arg: { ↓(bar) in })
    call(arg: { ↓(bar, _) in })
    
    

### 规则114: unused\_closure\_parameter

swiftlint建议最好把不使用的闭包参数使用 “\_”代替

识别码

默认是否启用

是否支持自动更正

类型

unused\_closure\_parameter

启用

yes

lint

代码示例:

    //不会触发warning
    [1, 2].map { number in
     number + 1 
    }
    [1, 2].map { _ in
     3 
    }
    
    //会触发warning
    [1, 2].map { ↓number in
     return 3
    }
    [1, 2].map { ↓number in
     return numberWithSuffix
    }
    
    

### 规则115: unused\_enumerated

在for遍历数组时, 如有未使用的索引,不建议使用.enumerated()

识别码

默认是否启用

是否支持自动更正

类型

unused\_enumerated

启用

no

idiomatic

代码示例:

    //不会触发warning
    for (idx, foo) in bar.enumerated() { }
    for (_, foo) in bar.enumerated().something() { }
    for (_, foo) in bar.something() { }
    
    //会触发warning
    for (↓_, foo) in bar.enumerated() { }
    for (↓_, foo) in abc.bar.enumerated() { }
    for (↓_, foo) in abc.something().enumerated() { }
    for (idx, ↓_) in bar.enumerated() { }
    

### 规则116: unused\_optional\_binding

在使用if判断某变量是否为nil的时候, 不建议使用下划线(\_)

识别码

默认是否启用

是否支持自动更正

类型

unused\_optional\_binding

启用

no

style

代码示例:

    //不会触发warning
    if let bar = Foo.optionalValue {
    }
    
    //会触发warning
    if let ↓_ = Foo.optionalValue {
    }
    if let a = Foo.optionalValue, let ↓_ = Foo.optionalValue2 {
    }
    

### 规则117: valid\_ibinspectable

@IBInspectable在swiftlint中的使用需要注意， 第一必须是变量， 第二必须要有指定的类型，如果指定的类型是可选类型或者隐式类型，则目前官方只支持以下几种类型：

String, NSString, UIColor, NSColor, UIImage, NSImage.

识别码

默认是否启用

是否支持自动更正

类型

valid\_ibinspectable

启用

no

lint

代码示例:

    /// 指定为变量var， 类型为String？和String！
    @IBInspectable private var yyy: String?
    @IBInspectable private var zzz: String!
    
    /// 如果写成这样，编译能通过，但是会触发警告, 因为swiftlint暂不支持Int可选和隐式类型:
    @IBInspectable private var dddl: Int!
    @IBInspectable private var eeel: Int?
    
    /// 如果指定的类型不是可选类型， 就应该初始化，否则系统不允许，会报错所在的类没有初始化
    对：
    @IBInspectable private var counts: Int = 0
    系统报错：
    @IBInspectable private var counts: Int 
    
    

### 规则118: vertical\_parameter\_alignment

垂直方向上的参数对齐。当函数参数有多行的时候， 函数参数在垂直方向上应该对齐（参数换行的时候左边对齐）

识别码

默认是否启用

是否支持自动更正

类型

vertical\_parameter\_alignment

启用

no

style

代码示例:

    //不会触发warning
    func validateFunction(_ file: File, kind: SwiftDeclarationKind,
                          dictionary: [String: SourceKitRepresentable]) { }
                          
    func validateFunction(_ file: File, kind: SwiftDeclarationKind,
                          dictionary: [String: SourceKitRepresentable])
                          -> [StyleViolation]
    //会触发warning
    func validateFunction(_ file: File, kind: SwiftDeclarationKind,
                      ↓dictionary: [String: SourceKitRepresentable]) { }
    

### 规则119: vertical\_parameter\_alignment\_on\_call

当调用多个参数的函数时,如果参数多行显示,则应该垂直对齐

识别码

默认是否启用

是否支持自动更正

类型

vertical\_parameter\_alignment\_on\_call

未启用

no

style

代码示例:

    //不会触发warning
    foo(param1: 1, param2: bar
        param3: false, param4: true)
    foo(param1: 1, param2: bar)
    foo(param1: 1, param2: bar
        param3: false,
        param4: true)
    
    
    //会触发warning
    foo(param1: 1, param2: bar
                    ↓param3: false, param4: true)
                    
    foo(param1: 1, param2: bar
     ↓param3: false, param4: true)
     
    foo(param1: 1, param2: bar
           ↓param3: false,
           ↓param4: true)
    
    
    

### 规则120: vertical\_whitespace

垂直方向上的空格行，限制为一行（注释除外）

识别码

默认是否启用

是否支持自动更正

类型

vertical\_whitespace

启用

yes

style

代码示例:

    /// 没有空格， nonTriggerWarning
    override func viewDidLoad() {
        super.viewDidLoad()
        let aaa = 0
    }   
    
    /// 有一行空格, nonTriggerWarning
    override func viewDidLoad() {
        super.viewDidLoad()
        let aaa = 0
        ............................1
    }
    
    /// >=2行，就会触发警告
    override func viewDidLoad() {
        super.viewDidLoad()
        let aaa = 0
       .............................1
       .............................2
    }
    

### 规则121: void\_return

多余的返回值为空， 在函数声明的时候，返回值为空是多余的。定义常量或者变量的时候可以

识别码

默认是否启用

是否支持自动更正

类型

void\_return

启用

yes

style

代码示例:

    /// 这个属性要求这样写， 返回值为空省略
    func XingYun() {
        print("titan")
    }
    
    /// 这个属性要求别这样写，否则会有warning（但是我在swift 3.0上测试并没有触发warning）
    func XingYun() -> Void {
        print("titan")
    }
    
    

### 规则122: weak\_delegate

代理应该写成weak类型（弱代理）来避免循环引用

识别码

默认是否启用

是否支持自动更正

类型

weak\_delegate

启用

no

lint

代码示例:

    /// 1.1 编译通过
    class Langke {
        var chenlong: NSObjectProtocol?
    }
    
    /// 1.2 编译通过，但是触发swiftlint的 weak_delegate警告， 原因是变量名 myDelegate 中有 delegate 关键字，这属于名字滥用
    class Langke {
        var myDelegate: NSObjectProtocol?
    }
    
    /// 1.3 编译通过， 不会触发警告， 原因是在 var 关键字前面加了 weak
    class Langke {
        weak var myDelegate: NSObjectProtocol?
    }
    
    
    /// 2.1 编译通过，但是触发 weak_delegate 警告，原因是 scrollDelegate 中 Delegate 放在了最后， 被理解成了代理
    class Langke {
        var scrollDelegate: UIScrollViewDelegate?
    }
    
    /// 2.2 编译通过， 既然变量名被理解成了代理， 那为了类似防止循环引用， 应该加关键字 weak
    class Langke {
        weak var scrollDelegate: UIScrollViewDelegate?
    }
    
    /// 编译通过， 不会触发警告， 因为delegate放在了前面， 没有被理解成代理
    class Langke {
        var delegateScroll: UIScrollViewDelegate?
    }
    

### 规则123: xctfail\_message

单元测试中,XCTFail调用应该包括声明描述

识别码

默认是否启用

是否支持自动更正

类型

xctfail\_message

启用

no

idiomatic

### 规则124: yoda\_condition

执行判断语句时, 变量名应该放在运算符的左边

识别码

默认是否启用

是否支持自动更正

类型

yoda\_condition

未启用

no

lint

代码示例:

    //不会触发warning
    if foo == 42 {}
    if foo <= 42.42 {}
    guard foo >= 42 else { return }
    guard foo != "str str" else { return }
    
    //会触发warning
    ↓if 42 == foo {}
    ↓if 42.42 >= foo {}
    ↓guard 42 <= foo else { return }
    ↓guard "str str" != foo else { return }
    ↓while 10 > foo { }
    
    

> 文中如有不足之处请多指教

> 持续更新中.....